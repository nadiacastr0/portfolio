const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement;
let currentPage = 1;
const projectsPerPage = 6;
const githubUsername = "nadiacastr0";
const projectsContainer = document.getElementById("project-cards");

function changeTheme() {
  const currentTheme = rootHtml.getAttribute("data-theme");
  rootHtml.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "ligth" : "dark"
  );
  toggleTheme.classList.toggle("bi-brightness-low-fill");
  toggleTheme.classList.toggle("bi-moon-stars-fill");
}

function hideSections() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const links = document.querySelectorAll(".menu__link");
  links.forEach((link) => {
    link.classList.remove("active");
  });
}

function showSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.style.display = "block";
  }

  const link = document.querySelector(`.menu__link[href="#${id}"]`);
  if (link) {
    link.classList.add("active");
  }
}

function changePage(direction) {
  currentPage += direction;
  currentPage = currentPage < 1 ? 1 : currentPage;
  fetchProjects(currentPage);
}

async function fetchProjects(page = 1) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?page=${page}&per_page=${projectsPerPage}&sort=created&direction=desc`
    );
    const projects = await response.json();
    projectsContainer.innerHTML = "";

    projects.forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      card.innerHTML = `
                <h3>${project.name}</h3>                
                <p>${project.description || "Sem descrição"}</p>
                <a href="${project.html_url}" target="_blank">Ver no GitHub</a>
            `;

      projectsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar os projetos:", error);
  }
}

toggleTheme.addEventListener("click", changeTheme);

document.querySelectorAll(".menu__link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);

    hideSections();
    showSection(targetId);
  });
});

document
  .querySelector('.menu__link[href="#projetos"]')
  .addEventListener("click", (e) => {
    e.preventDefault();
    const projetosSection = document.getElementById("projetos");
    projetosSection.style.display = "block";
    projetosSection.scrollIntoView({ behavior: "smooth" });
    fetchProjects(currentPage);
  });

document.addEventListener("DOMContentLoaded", () => {
  showSection("sobre");
});
