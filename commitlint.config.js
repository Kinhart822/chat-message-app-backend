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
        // 'scope-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 72],
    },
};