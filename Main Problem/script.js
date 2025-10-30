// Global array to store student data
var students = [];

// Load data from localStorage on page load
window.onload = function() {
  var storedData = localStorage.getItem("studentsData");
  if (storedData) {
    students = JSON.parse(storedData);
    renderTable();
  }
};

// Add new student
function addStudent() {
  var name = prompt("Enter student name:");

  // Validate name (letters and spaces only)
  if (!name || name.trim() === "") {
    alert("Name cannot be empty. Please enter a valid name.");
    return;
  }
  var namePattern = /^[A-Za-z\s]+$/;
  if (!namePattern.test(name)) {
    alert("Name can only contain letters and spaces. Please enter a valid name.");
    return;
  }

  // Collect marks
  var marks = [];
  for (var i = 1; i <= 5; i++) {
    var input = prompt("Enter marks for Subject " + i + " (0–100):", "0");
    var mark = parseFloat(input);

    if (isNaN(mark) || mark < 0 || mark > 100) {
      alert("Invalid input. Please enter a number between 0 and 100.");
      return;
    }

    marks.push(mark);
  }

  var totalMarks = calculateTotal(marks);
  var averageMarks = calculateAverage(marks);

  var student = {
    name: name.trim(),
    marks: marks,
    total: totalMarks,
    average: averageMarks
  };

  students.push(student);
  saveData();
  renderTable();
}

// Calculate total marks
function calculateTotal(marks) {
  var sum = 0;
  for (var i = 0; i < marks.length; i++) {
    sum += marks[i];
  }
  return sum;
}

// Calculate average marks
function calculateAverage(marks) {
  var total = calculateTotal(marks);
  return (total / marks.length).toFixed(2);
}

// Render the table dynamically
function renderTable() {
  var table = document.getElementById("marksTable");

  // Remove old rows (keep header)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (var i = 0; i < students.length; i++) {
    var student = students[i];
    var newRow = table.insertRow(-1);

    // Name
    var nameCell = newRow.insertCell(0);
    nameCell.textContent = student.name;

    // Marks
    for (var j = 0; j < student.marks.length; j++) {
      var cell = newRow.insertCell(j + 1);
      cell.textContent = student.marks[j];
    }

    // Total
    var totalCell = newRow.insertCell(6);
    totalCell.textContent = student.total;

    // Average
    var avgCell = newRow.insertCell(7);
    avgCell.textContent = student.average;

    // Delete button
    var delCell = newRow.insertCell(8);
    var delButton = document.createElement("button");
    delButton.textContent = "Delete";
    delButton.style.backgroundColor = "#f44336";
    delButton.onclick = (function(index) {
      return function() {
        if (confirm("Are you sure you want to delete this student?")) {
          students.splice(index, 1);
          saveData();
          renderTable();
        }
      }
    })(i);
    delCell.appendChild(delButton);
  }

  // Add header for delete column if not already added
  if (table.rows[0].cells.length < 9) {
    var headerCell = table.rows[0].insertCell(8);
    headerCell.textContent = "Action";
  }
}

// Save students array to localStorage
function saveData() {
  localStorage.setItem("studentsData", JSON.stringify(students));
}
