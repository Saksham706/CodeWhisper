import { execute } from "../services/executeService.js";

/**
 * POST /api/execute
 * Body:
 * {
 *   language: "c" | "cpp" | "java" | "python",
 *   filePath: "main.cpp",
 *   stdin?: "input text"
 * }
 */
export const executeCode = async (req, res) => {
  const { language, filePath, stdin } = req.body;

  /* -------- Validation -------- */

  if (!language || !filePath) {
    return res.status(400).json({
      output: "",
      error: "language and filePath are required",
    });
  }

  const allowedLanguages = ["c", "cpp", "java", "python"];
  if (!allowedLanguages.includes(language)) {
    return res.status(400).json({
      output: "",
      error: "Unsupported language",
    });
  }

  /* -------- Execution -------- */

  try {
    const result = await execute(
      language,
      filePath,
      stdin || "" // ✅ STDIN support
    );

    return res.json({
      output: result.stdout || "",
      error: result.stderr || "",
    });
  } catch (err) {
    console.error("Execution failed:", err);

    return res.status(500).json({
      output: "",
      error: err.message || "Execution error",
    });
  }
};