/**
 * Проверяет public/ перед сборкой.
 *
 * public/ — отдельный репозиторий (см. DEVELOPMENT.md), поэтому в свежем клоне
 * исходников его может не быть. Без него сборка падает с невнятным
 * module-not-found, так что ловим это здесь и объясняем по-человечески.
 */
import { existsSync, readFileSync } from "node:fs";

const CONTENT = "public/content.json";

const REQUIRED_KEYS = [
  "siteMetadata",
  "heroData",
  "skillsData",
  "clientsData",
  "projectsCasesData",
  "projectsCategoriesData",
  "reviewersData",
  "gratitudeImagesData",
  "questionsData",
];

// Объявлена через function, а не через const: только в этом виде TypeScript
// понимает, что вызов не возвращает управление, и не требует return после него.
function fail(title: string, ...details: string[]): never {
  console.error(`\n  ✖ ${title}\n`);
  for (const line of details) console.error(`    ${line}`);
  console.error("");
  process.exit(1);
}

if (!existsSync(CONTENT)) {
  fail(
    "Не найден public/content.json — папка public/ не склонирована.",
    "public/ живёт в отдельном репозитории с контентом.",
    "Склонируйте его в корень проекта под именем public:",
    "",
    "    git clone <URL-репозитория-с-контентом> public",
  );
}

function parse(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(
      "public/content.json — битый JSON, сборка невозможна.",
      String(err instanceof Error ? err.message : err),
      "",
      "Скорее всего лишняя или пропущенная запятая, либо незакрытая кавычка.",
    );
  }
}

const data = parse(readFileSync(CONTENT, "utf8"));

const missing = REQUIRED_KEYS.filter((key) => !(key in data));
if (missing.length) {
  fail(
    `В public/content.json нет обязательных разделов: ${missing.join(", ")}`,
    "Удалять разделы верхнего уровня нельзя — на них опирается вёрстка.",
  );
}

// Пути к картинкам разбросаны по всему дереву контента, собираем их рекурсивно.
const imagePaths = new Set<string>();
const walk = (node: unknown): void => {
  if (typeof node === "string") {
    if (node.startsWith("/images/")) imagePaths.add(node);
  } else if (Array.isArray(node)) {
    node.forEach(walk);
  } else if (node && typeof node === "object") {
    Object.values(node).forEach(walk);
  }
};
walk(data);

const brokenImages = [...imagePaths].filter(
  (path) => !existsSync(`public${decodeURIComponent(path)}`),
);
if (brokenImages.length) {
  fail(
    `В public/content.json ${brokenImages.length} ссылок на несуществующие картинки:`,
    ...brokenImages.map((path) => `- ${path}`),
    "",
    "Положите файлы в public/images/ или поправьте пути.",
  );
}

console.log(
  `prebuild: content.json в порядке, картинок проверено ${imagePaths.size}`,
);
