import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import Student from './src/Student.js';
import StudentManager from './src/StudentManager.js';

// Nama file untuk data persistence dan laporan
const DATA_FILE = './students.json';
const REPORT_FILE = './laporan_siswa.txt';

// Fungsi untuk memuat data siswa dari file JSON
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const arr = JSON.parse(raw);
    // Membuat ulang instance Student dari data JSON
    return arr.map(obj => {
      const s = new Student(obj.id, obj.name, obj.class);
      s.grades = obj.grades || {};
      return s;
    });
  }
  return [];
}

// Fungsi untuk menyimpan data siswa ke file JSON
function saveData(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
}

// Fungsi untuk export laporan siswa ke file teks
function exportReport(students) {
  let report = '=== LAPORAN SISWA ===\n';
  if (students.length === 0) {
    report += 'Belum ada data siswa.\n';
  } else {
    students.forEach(s => {
      report += `ID: ${s.id}\nNama: ${s.name}\nKelas: ${s.class}\n`;
      if (Object.keys(s.grades).length === 0) {
        report += 'Mata Pelajaran: -\n';
      } else {
        report += 'Mata Pelajaran:\n';
        for (const [subject, score] of Object.entries(s.grades)) {
          report += `  - ${subject}: ${score}\n`;
        }
      }
      const avg = s.getAverage();
      report += `Rata-rata: ${avg ? avg.toFixed(2) : '-'}\n`;
      report += `Status: ${s.getGradeStatus()}\n`;
      report += '------------------------\n';
    });
  }
  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  console.log(chalk.greenBright(`Laporan berhasil diexport ke ${REPORT_FILE}`));
}

// Membuat instance StudentManager dan memuat data awal
const manager = new StudentManager();
manager.students = loadData();

// Menampilkan menu utama aplikasi
function displayMenu() {
  console.log(chalk.blueBright('\n================================='));
  console.log(chalk.bold.yellow('SISTEM MANAJEMEN NILAI SISWA'));
  console.log(chalk.blueBright('================================='));
  console.log(chalk.cyan('1.') + ' Tambah Siswa Baru');
  console.log(chalk.cyan('2.') + ' Lihat Semua Siswa');
  console.log(chalk.cyan('3.') + ' Cari Siswa');
  console.log(chalk.cyan('4.') + ' Update Data Siswa');
  console.log(chalk.cyan('5.') + ' Hapus Siswa');
  console.log(chalk.cyan('6.') + ' Tambah Nilai Siswa');
  console.log(chalk.cyan('7.') + ' Lihat Top 3 Siswa');
  console.log(chalk.cyan('8.') + ' Export Laporan ke File');
  console.log(chalk.cyan('9.') + ' Filter Siswa Berdasarkan Kelas');
  console.log(chalk.cyan('10.') + ' Statistik Kelas');
  console.log(chalk.cyan('11.') + ' Keluar');
  console.log(chalk.blueBright('================================='));
}

// Fungsi untuk menambah siswa baru
function addNewStudent() {
  console.log(chalk.bold('\n--- Tambah Siswa Baru ---'));
  const id = readlineSync.question('ID Siswa: ').trim();
  if (!id) return console.log(chalk.red('ID tidak boleh kosong!'));
  if (manager.findStudent(id)) return console.log(chalk.yellow('ID sudah terdaftar!'));
  const name = readlineSync.question('Nama Siswa: ').trim();
  if (!name) return console.log(chalk.red('Nama tidak boleh kosong!'));
  const kelas = readlineSync.question('Kelas (misal: 10A): ').trim();
  if (!kelas) return console.log(chalk.red('Kelas tidak boleh kosong!'));
  const student = new Student(id, name, kelas);
  if (manager.addStudent(student)) {
    saveData(manager.getAllStudents());
    console.log(chalk.green('Siswa berhasil ditambahkan!'));
  } else {
    console.log(chalk.red('Gagal menambah siswa!'));
  }
}

// Fungsi untuk menampilkan semua siswa
function viewAllStudents() {
  console.log(chalk.bold('\n--- Daftar Semua Siswa ---'));
  if (manager.getAllStudents().length === 0) {
    console.log(chalk.yellow('Belum ada data siswa.'));
    return;
  }
  manager.displayAllStudents();
}

// Fungsi untuk mencari siswa berdasarkan ID
function searchStudent() {
  console.log(chalk.bold('\n--- Cari Siswa ---'));
  const id = readlineSync.question('Masukkan ID Siswa: ').trim();
  const student = manager.findStudent(id);
  if (!student) {
    console.log(chalk.red('Siswa tidak ditemukan.'));
    return;
  }
  student.displayInfo();
}

// Fungsi untuk mengupdate data siswa
function updateStudent() {
  console.log(chalk.bold('\n--- Update Data Siswa ---'));
  const id = readlineSync.question('Masukkan ID Siswa: ').trim();
  const student = manager.findStudent(id);
  if (!student) {
    console.log(chalk.red('Siswa tidak ditemukan.'));
    return;
  }
  student.displayInfo();
  const name = readlineSync.question('Nama baru (kosongkan jika tidak diubah): ').trim();
  const kelas = readlineSync.question('Kelas baru (kosongkan jika tidak diubah): ').trim();
  if (!name && !kelas) {
    console.log(chalk.yellow('Tidak ada perubahan.'));
    return;
  }
  if (manager.updateStudent(id, { name: name || student.name, class: kelas || student.class })) {
    saveData(manager.getAllStudents());
    console.log(chalk.green('Data siswa berhasil diupdate!'));
  } else {
    console.log(chalk.red('Gagal update data siswa!'));
  }
}

// Fungsi untuk menghapus siswa berdasarkan ID
function deleteStudent() {
  console.log(chalk.bold('\n--- Hapus Siswa ---'));
  const id = readlineSync.question('Masukkan ID Siswa: ').trim();
  const student = manager.findStudent(id);
  if (!student) {
    console.log(chalk.red('Siswa tidak ditemukan.'));
    return;
  }
  const confirm = readlineSync.question('Yakin ingin menghapus? (y/n): ').toLowerCase();
  if (confirm === 'y') {
    if (manager.removeStudent(id)) {
      saveData(manager.getAllStudents());
      console.log(chalk.green('Siswa berhasil dihapus.'));
    } else {
      console.log(chalk.red('Gagal menghapus siswa!'));
    }
  } else {
    console.log(chalk.yellow('Penghapusan dibatalkan.'));
  }
}

// Fungsi untuk menambah nilai pada siswa tertentu
function addGradeToStudent() {
  console.log(chalk.bold('\n--- Tambah Nilai Siswa ---'));
  const id = readlineSync.question('Masukkan ID Siswa: ').trim();
  const student = manager.findStudent(id);
  if (!student) {
    console.log(chalk.red('Siswa tidak ditemukan.'));
    return;
  }
  student.displayInfo();
  const subject = readlineSync.question('Nama Mata Pelajaran: ').trim();
  if (!subject) {
    console.log(chalk.red('Nama mata pelajaran tidak boleh kosong!'));
    return;
  }
  const scoreStr = readlineSync.question('Nilai (0-100): ').trim();
  const score = Number(scoreStr);
  if (isNaN(score) || score < 0 || score > 100) {
    console.log(chalk.red('Nilai harus berupa angka 0-100!'));
    return;
  }
  try {
    student.addGrade(subject, score);
    saveData(manager.getAllStudents());
    console.log(chalk.green('Nilai berhasil ditambahkan!'));
  } catch (err) {
    console.log(chalk.red('Gagal menambah nilai: ' + err.message));
  }
}

// Fungsi untuk menampilkan 3 siswa dengan rata-rata tertinggi
function viewTopStudents() {
  console.log(chalk.bold('\n--- Top 3 Siswa ---'));
  const top = manager.getTopStudents(3);
  if (top.length === 0) {
    console.log(chalk.yellow('Belum ada data siswa.'));
    return;
  }
  top.forEach((student, i) => {
    console.log(chalk.magentaBright(`\n#${i + 1}`));
    student.displayInfo();
  });
}

// Fungsi untuk menampilkan siswa berdasarkan kelas tertentu
function filterByClass() {
  console.log(chalk.bold('\n--- Filter Siswa Berdasarkan Kelas ---'));
  const kelas = readlineSync.question('Masukkan nama kelas (misal: 10A): ').trim();
  const filtered = manager.getAllStudents().filter(s => s.class.toLowerCase() === kelas.toLowerCase());
  if (filtered.length === 0) {
    console.log(chalk.yellow('Tidak ada siswa di kelas tersebut.'));
    return;
  }
  filtered.forEach(s => s.displayInfo());
}

// Fungsi untuk menampilkan statistik kelas (jumlah siswa, rata-rata, lulus/tidak lulus)
function classStatistics() {
  console.log(chalk.bold('\n--- Statistik Kelas ---'));
  const kelas = readlineSync.question('Masukkan nama kelas (misal: 10A): ').trim();
  const filtered = manager.getAllStudents().filter(s => s.class.toLowerCase() === kelas.toLowerCase());
  if (filtered.length === 0) {
    console.log(chalk.yellow('Tidak ada siswa di kelas tersebut.'));
    return;
  }
  const avg = filtered.reduce((sum, s) => sum + s.getAverage(), 0) / filtered.length;
  const lulus = filtered.filter(s => s.getGradeStatus() === 'Lulus').length;
  const tidakLulus = filtered.length - lulus;
  console.log(chalk.cyan(`Jumlah siswa: ${filtered.length}`));
  console.log(chalk.cyan(`Rata-rata kelas: ${isNaN(avg) ? '-' : avg.toFixed(2)}`));
  console.log(chalk.green(`Jumlah Lulus: ${lulus}`));
  console.log(chalk.red(`Jumlah Tidak Lulus: ${tidakLulus}`));
}

// Fungsi utama aplikasi (main loop)
function main() {
  console.log(chalk.bgBlue.white.bold('Selamat datang di Sistem Manajemen Nilai Siswa!'));
  let running = true;
  while (running) {
    displayMenu();
    const choice = readlineSync.question('Pilih menu (1-11): ').trim();
    switch (choice) {
      case '1': addNewStudent(); break;
      case '2': viewAllStudents(); break;
      case '3': searchStudent(); break;
      case '4': updateStudent(); break;
      case '5': deleteStudent(); break;
      case '6': addGradeToStudent(); break;
      case '7': viewTopStudents(); break;
      case '8': exportReport(manager.getAllStudents()); break;
      case '9': filterByClass(); break;
      case '10': classStatistics(); break;
      case '11': running = false; break;
      default: console.log(chalk.red('Pilihan tidak valid!'));
    }
  }
  console.log(chalk.bgGreen.white.bold('\nTerima kasih telah menggunakan aplikasi ini!'));
}

// Menjalankan aplikasi
main();