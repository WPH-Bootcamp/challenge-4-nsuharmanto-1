import Student from './Student.js';

// Class StudentManager untuk mengelola daftar siswa dan operasi terkait
class StudentManager {
  // Konstruktor: inisialisasi array students kosong
  constructor() {
    this.students = [];
  }

  // Menambah siswa baru ke daftar
  // Return false jika bukan instance Student atau ID sudah ada
  addStudent(student) {
    if (!(student instanceof Student)) return false;
    if (this.findStudent(student.id)) return false;
    this.students.push(student);
    return true;
  }

  // Menghapus siswa berdasarkan ID
  // Return true jika berhasil, false jika tidak ditemukan
  removeStudent(id) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    return true;
  }

  // Mencari siswa berdasarkan ID
  // Return objek Student jika ditemukan, null jika tidak
  findStudent(id) {
    return this.students.find(s => s.id === id) || null;
  }

  // Mengupdate data siswa (nama/kelas) berdasarkan ID
  // Return true jika berhasil, false jika siswa tidak ditemukan
  updateStudent(id, data) {
    const student = this.findStudent(id);
    if (!student) return false;
    if (data.name) student.name = data.name;
    if (data.class) student.class = data.class;
    return true;
  }

  // Mengembalikan semua data siswa dalam array
  getAllStudents() {
    return this.students;
  }

  // Mengambil n siswa dengan rata-rata nilai tertinggi
  // Hanya siswa yang punya nilai yang diikutkan
  getTopStudents(n) {
    return [...this.students]
      .filter(s => Object.keys(s.grades).length > 0)
      .sort((a, b) => b.getAverage() - a.getAverage())
      .slice(0, n);
  }

  // Menampilkan semua data siswa ke terminal
  displayAllStudents() {
    if (this.students.length === 0) {
      console.log('Belum ada data siswa.');
      return;
    }
    this.students.forEach(s => s.displayInfo());
  }
}

export default StudentManager;