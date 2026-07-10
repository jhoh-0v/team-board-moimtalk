const defaultPosts = [
  { id: 1, category: "공지", title: "12시 10분까지 조별 활동 진행", content: "GitHub 레포지토리에 프로젝트를 올리고 Vercel 배포까지 완료해요.", author: "조장", date: "오늘", likes: 4 },
  { id: 2, category: "아이디어", title: "우리 조 프로젝트는 미니 게시판으로 가요", content: "글 작성, 검색, 카테고리 분류가 되는 가벼운 웹앱으로 정리했습니다.", author: "김민지", date: "10:32", likes: 3 },
  { id: 3, category: "질문", title: "배포 주소는 문서에 어떻게 남길까요?", content: "레포지토리와 배포 링크를 함께 적고, 화면 캡처도 넣으면 제출하기 좋을 것 같아요.", author: "이준호", date: "10:41", likes: 2 },
  { id: 4, category: "아이디어", title: "발표 전 마지막 확인 목록", content: "모바일 화면 확인, README 작성, 배포 링크 접속 테스트를 체크해 주세요.", author: "박서연", date: "11:05", likes: 5 }
];

let posts = JSON.parse(localStorage.getItem("moimtalk-posts")) || defaultPosts;
let activeCategory = "전체";
let query = "";
const postList = document.querySelector("#postList");
const template = document.querySelector("#postTemplate");
const composer = document.querySelector("#composer");

function renderPosts() {
  const filtered = posts.filter(post => (activeCategory === "전체" || post.category === activeCategory) && `${post.title} ${post.content}`.toLowerCase().includes(query));
  postList.replaceChildren();
  filtered.forEach(post => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".post-card");
    node.querySelector(".tag").textContent = post.category;
    node.querySelector(".date").textContent = post.date;
    node.querySelector("h3").textContent = post.title;
    node.querySelector(".post-copy").textContent = post.content;
    node.querySelector(".author").textContent = `by ${post.author}`;
    node.querySelector(".like-button span").textContent = post.likes;
    node.querySelector(".like-button").addEventListener("click", event => {
      post.likes += 1;
      event.currentTarget.classList.add("liked");
      localStorage.setItem("moimtalk-posts", JSON.stringify(posts));
      renderPosts();
    });
    postList.append(node);
  });
  document.querySelector("#postCount").textContent = posts.length;
  document.querySelector("#allCount").textContent = posts.length;
  document.querySelector("#resultText").textContent = `${filtered.length}개의 글`;
  lucide.createIcons();
}

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderPosts();
}));
document.querySelector("#searchInput").addEventListener("input", event => { query = event.target.value.trim().toLowerCase(); renderPosts(); });
document.querySelector("#openComposer").addEventListener("click", () => composer.showModal());
document.querySelector("#submitPost").addEventListener("click", () => {
  const form = document.querySelector("#postForm");
  if (!form.reportValidity()) return;
  posts.unshift({ id: Date.now(), category: document.querySelector("#category").value, title: document.querySelector("#title").value, content: document.querySelector("#content").value, author: "나", date: "방금", likes: 0 });
  localStorage.setItem("moimtalk-posts", JSON.stringify(posts));
  form.reset(); composer.close(); activeCategory = "전체";
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "전체"));
  renderPosts();
});
document.querySelector("#themeButton").addEventListener("click", () => { document.body.classList.toggle("dark"); lucide.createIcons(); });
renderPosts();
