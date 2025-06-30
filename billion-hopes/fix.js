const fs = require('fs');

const filePath = 'src/pages/ManageCourses.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'course.fees.toLocaleString()',
  '(course.fees || 0).toLocaleString()'
);

content = content.replace(
  'selectedCourse.fees.toLocaleString()',
  '(selectedCourse.fees || 0).toLocaleString()'
);

fs.writeFileSync(filePath, content);
console.log('Fixed!'); 
