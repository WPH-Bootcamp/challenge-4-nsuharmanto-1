// Class Student merepresentasikan data dan perilaku seorang siswa
class Student {
  // Konstruktor untuk membuat objek Student baru
  constructor(id, name, kelas) {
    this.id = id;           // ID unik siswa
    this.name = name;       // Nama siswa
    this.class = kelas;     // Kelas siswa (misal: 10A)
    this.grades = {};       // Objek untuk menyimpan nilai mata pelajaran
  }

  // Method untuk menambah atau mengupdate nilai pada mata pelajaran tertentu
  addGrade(subject, score) {
    // Validasi nama mata pelajaran harus string dan tidak kosong
    if (typeof subject !== 'string' || !subject.trim()) {
      throw new Error('Nama mata pelajaran tidak valid.');
    }
    // Validasi nilai harus angka 0-100
    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('Nilai harus berupa angka 0-100.');
    }
    this.grades[subject] = score; // Simpan nilai ke dalam objek grades
  }

  // Method untuk menghitung rata-rata nilai semua mata pelajaran
  getAverage() {
    const scores = Object.values(this.grades);
    if (scores.length === 0) return 0; // Jika belum ada nilai, rata-rata 0
    const sum = scores.reduce((a, b) => a + b, 0);
    return sum / scores.length;
  }

  // Method untuk menentukan status kelulusan berdasarkan rata-rata nilai
  getGradeStatus() {
    return this.getAverage() >= 75 ? 'Lulus' : 'Tidak Lulus';
  }

  // Method untuk menampilkan informasi lengkap siswa ke terminal
  displayInfo() {
    console.log(`ID: ${this.id}`);
    console.log(`Nama: ${this.name}`);
    console.log(`Kelas: ${this.class}`);
    if (Object.keys(this.grades).length === 0) {
      console.log('Mata Pelajaran: -');
    } else {
      console.log('Mata Pelajaran:');
      for (const [subject, score] of Object.entries(this.grades)) {
        console.log(`  - ${subject}: ${score}`);
      }
    }
    const avg = this.getAverage();
    console.log(`Rata-rata: ${avg ? avg.toFixed(2) : '-'}`);
    console.log(`Status: ${this.getGradeStatus()}`);
    console.log('------------------------');
  }
}

export default Student;