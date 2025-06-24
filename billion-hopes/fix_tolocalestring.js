// Quick fix for toLocaleString error
const fs = require('fs');

const filePath = 'src/pages/ManageCourses.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace problematic toLocaleString calls with safe versions
content = content.replace(
  'course.fees.toLocaleString()',
  '(course.fees || 0).toLocaleString()'
);

content = content.replace(
  'selectedCourse.fees.toLocaleString()',
  '(selectedCourse.fees || 0).toLocaleString()'
);

fs.writeFileSync(filePath, content);
console.log('✅ Fixed toLocaleString errors in ManageCourses.tsx'); 