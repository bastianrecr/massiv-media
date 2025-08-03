const yearSpan = document.getElementById("year");

const updateFooterYear = () => {
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
};

export { updateFooterYear };
