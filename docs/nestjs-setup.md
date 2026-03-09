## 1. Setup Project

```bash
npm i -g @nestjs/cli
nest new project-name
npm run start:dev
```

## 2. Setup Database

- **PostgreSQL (TypeORM):**

```bash
npm install @nestjs/typeorm typeorm pg
```

- **MongoDB (Mongoose):**

```bash
npm install @nestjs/mongoose mongoose
```

## 3. Authentication Setup

- **Hash password:**

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

- **Validation:**

```bash
npm install class-validator class-transformer
```

- **Passport Local:**

```bash
npm install @nestjs/passport passport passport-local
npm install -D @types/passport-local
```

- **JWT:**

```bash
npm install @nestjs/jwt passport-jwt
npm install -D @types/passport-jwt
```

## 4. Setup Email

```bash
npm install @nestjs-modules/mailer nodemailer
npm install -D @types/nodemailer
```

## 5. Setup Swagger

```bash
npm install @nestjs/swagger swagger-ui-express
```

## 6. Setup Transformer and Validator

```bash
yarn add class-transformer class-validator
```

## 7. Husky & Commitlint

### Cài đặt thư viện

```bash
npm install -D husky @commitlint/cli @commitlint/config-conventional
```

### Cấu hình `package.json`

Thêm script prepare để Husky tự khởi tạo:

```json
"scripts": {
  "prepare": "if exist node_modules\\husky (npx husky install) else (echo husky is not installed)"
}
```

### Cấu hình `commitlint.config.js`

```javascript
/*
 * Giải thích cấu hình Commitlint:
 *
 * Mức độ (Level):
 *   0: Tắt (Off) - Không kiểm tra.
 *   1: Cảnh báo (Warning) - Cho phép commit nhưng hiển thị thông báo.
 *   2: Lỗi (Error) - Chặn commit nếu không tuân thủ.
 *
 * Các Rule cấu hình:
 *   - type-enum: Loại commit (type) phải thuộc danh sách được định nghĩa (feat, fix, refactor...).
 *   - type-case: Loại commit phải được viết thường (lower-case).
 *   - type-empty: Loại commit không được để trống.
 *   - scope-empty: Phạm vi ảnh hưởng (scope) không được để trống.
 *   - subject-empty: Nội dung ngắn (subject) không được để trống.
 *   - subject-full-stop: Nội dung ngắn không được kết thúc bằng dấu chấm.
 *   - header-max-length: Tổng chiều dài header (type + scope + subject) không vượt quá 72 ký tự.
 */

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat',         // Tính năng mới
				'fix',          // Sửa lỗi
				'improve',      // Cải thiện code
				'refactor',     // Tái cấu trúc code
				'docs',         // Thêm tài liệu
				'chore',        // Thay đổi nhỏ trong quá trình phát triển
				'style',        // Sửa lỗi kiểu chữ, định dạng, không ảnh hưởng đến logic
				'test',         // Viết test
				'revert',       // Revert lại commit trước đó
				'ci',           // Thay đổi cấu hình CI/CD
				'build',        // Build tệp tin
			],
		],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'scope-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'header-max-length': [2, 'always', 72],
	},
};
```

### Thiết lập Git Hooks

Husky v9+ đã bỏ lệnh `npx husky add`. Để thiết lập hooks, bạn chỉ cần tạo các file tương ứng trong thư mục `.husky/`:

- **Pre-commit**: Kiểm tra Lint (lint-staged) trước khi commit:
  Tạo file `.husky/pre-commit`:

```bash
#!/bin/sh
npx lint-staged
```

- **Commit-msg**: Kiểm tra cấu trúc Commit Message:
  Tạo file `.husky/commit-msg`:

```bash
#!/bin/sh
npx --no -- commitlint --edit "$1"
```

- **Pre-push**: Kiểm tra Lint và Build trước khi push:
  Tạo file `.husky/pre-push`:

```bash
#!/bin/sh
npm run lint && npm run build
```

> **Lưu ý**: Sau khi tạo file, hãy đảm bảo các file này có quyền thực thi (executable). Trên Linux/macOS dùng `chmod +x .husky/*`. Trên Windows, Husky sẽ tự động xử lý khi được cài đặt đúng.

## 8. Nest CLI Commands

- **Generate resource:**

```bash
nest g resource users --no-spec
```

- **Generate module:**

```bash
nest g module users
```

- **Generate service:**

```bash
nest g service users
```

- **Generate controller:**

```bash
nest g controller users
```
