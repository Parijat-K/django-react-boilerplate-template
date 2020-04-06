const prod = {
  base_url: "",
  credentials: "same-origin"
}
const dev = {
  base_url: "http://localhost:8000",
  credentials: "include"
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;