/**
 * Чистит статический экспорт от файлов, которые попадать на сайт не должны.
 *
 * Next копирует содержимое public/ в out/ целиком. Так как public/ — отдельный
 * git-репозиторий, вместе с контентом туда уезжают .git и служебные файлы репо.
 * Публиковать .git нельзя: по /.git/ выкладывается наружу вся история.
 */
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

/** Служебное из контент-репозитория, лежит в корне out/ (см. public/). */
const REPO_JUNK = [".git", ".gitignore", "README.md"];

/** Артефакты Next: RSC-payload для клиентской навигации и дефолтная 404. */
const isNextJunk = (name: string): boolean =>
  name.endsWith(".txt") ||
  name === "404.html" ||
  name === "_not-found.html" ||
  name === "_not-found";

const collect = (dir: string, root = true): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (isNextJunk(e.name) || (root && REPO_JUNK.includes(e.name))) return [path];
    return e.isDirectory() ? collect(path, false) : [];
  });

const size = (path: string): number =>
  statSync(path).isDirectory()
    ? readdirSync(path).reduce((sum, name) => sum + size(join(path, name)), 0)
    : statSync(path).size;

const junk = collect(OUT);

let freed = 0;
for (const path of junk) {
  freed += size(path);
  rmSync(path, { recursive: true, force: true });
}

console.log(
  `postbuild: удалено ${junk.length} шт., освобождено ${(freed / 1024 / 1024).toFixed(1)} МБ`,
);
