import fs from "fs";
import path from "path";

export function detectProject(workspacePath) {
  const files = fs.readdirSync(workspacePath);

  if (files.includes("pom.xml")) {
    return {
      type: "spring-boot",
      run: "mvn spring-boot:run",
      preview: "http://localhost:8080",
    };
  }

  if (files.includes("package.json")) {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(workspacePath, "package.json"), "utf-8")
    );

    if (pkg.scripts?.dev) {
      return {
        type: "node",
        run: "npm install && npm run dev",
        preview: "http://localhost:3000",
      };
    }

    if (pkg.scripts?.start) {
      return {
        type: "node",
        run: "npm install && npm start",
        preview: "http://localhost:3000",
      };
    }
  }

  if (files.includes("requirements.txt") || files.includes("app.py")) {
    return {
      type: "python",
      run: "pip install -r requirements.txt || true && python app.py",
      preview: "http://localhost:5000",
    };
  }

  return null;
}
