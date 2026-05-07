import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import fs from 'fs'

async function main() {
  console.log('Start seeding real data from MySQL...')

  // 1. Bersihkan seluruh tabel
  await prisma.systemLog.deleteMany()
  await prisma.notifikasiSistem.deleteMany()
  await prisma.transaksiPangan.deleteMany()
  await prisma.stokPanganBulanan.deleteMany()
  await prisma.berita.deleteMany()
  await prisma.msKomoditas.deleteMany()
  await prisma.profilMitra.deleteMany()
  await prisma.profilAdmin.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleaned.')

  // 2. Users Asli
  const defaultPassword = await bcrypt.hash('password123', 10)
  const users = [
    { id_user: 1, username: 'dev_it', password: defaultPassword, role: 'super_admin' as const, nama_lengkap: 'IT Developer', status: 'aktif' as const, created_at: new Date('2025-12-21T10:02:53Z') },
    { id_user: 2, username: 'kadis_pangan', password: defaultPassword, role: 'admin_dinas' as const, nama_lengkap: 'Verifikator Dinas', status: 'aktif' as const, created_at: new Date('2025-12-21T10:02:53Z') },
    { id_user: 3, username: 'ud_rejeki', password: defaultPassword, role: 'mitra' as const, nama_lengkap: 'UD Sumber Rejeki', status: 'aktif' as const, created_at: new Date('2025-12-21T10:02:53Z') },
    { id_user: 4, username: 'pasar_higienis', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T02:36:39Z') },
    { id_user: 6, username: 'pasar_bastiong', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T02:39:20Z') },
    { id_user: 7, username: 'pasar_dufa', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T02:41:14Z') },
    { id_user: 8, username: 'pasar_gamalama', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T02:41:14Z') },
    { id_user: 9, username: 'agen_kota_baru', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T02:41:14Z') },
    { id_user: 11, username: 'admin_dinas', password: defaultPassword, role: 'admin_dinas' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T04:09:42Z') },
    { id_user: 12, username: 'Mitra login', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-21T22:11:10Z') },
    { id_user: 13, username: 'Pasar_toboko', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-21T23:23:44Z') },
    { id_user: 14, username: 'pasar_baru', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2025-12-22T05:03:34Z') },
    { id_user: 15, username: 'pasar_kalumata', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:21:46Z') },
    { id_user: 16, username: 'super_murah', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:22:44Z') },
    { id_user: 17, username: 'toko_swalayan_jaya', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:22:55Z') },
    { id_user: 18, username: 'distributor_maluku', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:23:27Z') },
    { id_user: 19, username: 'toko_tani_sejahtera', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:24:13Z') },
    { id_user: 20, username: 'toko_berkah', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:24:13Z') },
    { id_user: 21, username: 'toko_harapan', password: defaultPassword, role: 'mitra' as const, status: 'aktif' as const, created_at: new Date('2026-02-03T10:24:13Z') },
  ]
  await prisma.user.createMany({ data: users })
  console.log('Users seeded.')

  // 3. Profil Admin
  const profilAdmins = [
    { id_admin: 2, id_user: 11, nama_lengkap: 'Super Admin Dinas', no_hp: '08111222333' },
    { id_admin: 3, id_user: 1, nama_lengkap: 'dev_it', no_hp: '-' },
    { id_admin: 4, id_user: 2, nama_lengkap: 'kadis_pangan', no_hp: '-' },
  ]
  await prisma.profilAdmin.createMany({ data: profilAdmins })

  // 4. Profil Mitra
  const profilMitras = [
    { id_mitra: 1, id_user: 3, nama_usaha: 'UD Sumber Rejeki', kategori_usaha: 'Distributor' as const, alamat: null, kontak_hp: null, latitude: null, longitude: null },
    { id_mitra: 2, id_user: 7, nama_usaha: 'Pasar Dufa-Dufa', kategori_usaha: 'Pasar' as const, alamat: 'Dufa-Dufa, Ternate Utara', kontak_hp: '081272624110', latitude: 0.805432, longitude: 127.388765 },
    { id_mitra: 3, id_user: 8, nama_usaha: 'Pasar Gamalama (Barito)', kategori_usaha: 'Pasar' as const, alamat: 'Gamalama, Ternate Tengah', kontak_hp: '081250375022', latitude: 0.790111, longitude: 127.384222 },
    { id_mitra: 4, id_user: 9, nama_usaha: 'Agen Pangan Kota Baru', kategori_usaha: 'Distributor' as const, alamat: 'Kota Baru, Ternate Tengah', kontak_hp: '081293561138', latitude: 0.785678, longitude: 127.380123 },
    { id_mitra: 5, id_user: 4, nama_usaha: 'Pasar Higienis', kategori_usaha: 'Pasar' as const, alamat: 'Alamat Pasar Higienis', kontak_hp: '0821364582', latitude: 0.792, longitude: 127.385 },
    { id_mitra: 6, id_user: 12, nama_usaha: 'Mitra Baru', kategori_usaha: 'Pasar' as const, alamat: '-', kontak_hp: null, latitude: null, longitude: null },
    { id_mitra: 7, id_user: 13, nama_usaha: 'Pasar Toboko', kategori_usaha: 'Pasar' as const, alamat: '-', kontak_hp: null, latitude: null, longitude: null },
    { id_mitra: 8, id_user: 14, nama_usaha: 'Pasar Baru', kategori_usaha: 'Pasar' as const, alamat: '-', kontak_hp: null, latitude: null, longitude: null },
    { id_mitra: 9, id_user: 15, nama_usaha: 'Pasar Kalumata', kategori_usaha: 'Pasar' as const, alamat: 'Kelurahan Kalumata, Ternate Tengah', kontak_hp: '082187654321', latitude: 0.788456, longitude: 127.382567 },
    { id_mitra: 10, id_user: 16, nama_usaha: 'Super Murah Ternate', kategori_usaha: 'Pasar' as const, alamat: 'Jl. Pahlawan Revolusi, Stadion, Ternate Tengah', kontak_hp: '081298765432', latitude: 0.789234, longitude: 127.383456 },
    { id_mitra: 11, id_user: 17, nama_usaha: 'Swalayan Jaya Ternate', kategori_usaha: 'Pasar' as const, alamat: 'Jl. Yos Sudarso, Muhajirin, Ternate Selatan', kontak_hp: '085244556677', latitude: 0.778901, longitude: 127.377234 },
    { id_mitra: 12, id_user: 18, nama_usaha: 'CV. Distributor Pangan Maluku Utara', kategori_usaha: 'Distributor' as const, alamat: 'Jl. Cengkeh Afo, Ternate Tengah', kontak_hp: '082199887766', latitude: 0.792345, longitude: 127.385678 },
    { id_mitra: 13, id_user: 19, nama_usaha: 'Toko Tani Sejahtera', kategori_usaha: 'Distributor' as const, alamat: 'Jl. Merdeka, Tanah Tinggi, Ternate Tengah', kontak_hp: '085266778899', latitude: 0.787654, longitude: 127.381234 },
    { id_mitra: 14, id_user: 20, nama_usaha: 'Toko Berkah Makmur', kategori_usaha: 'Pasar' as const, alamat: 'Kelurahan Toboko, Ternate Utara', kontak_hp: '081244332211', latitude: 0.802123, longitude: 127.38789 },
    { id_mitra: 15, id_user: 21, nama_usaha: 'Toko Harapan Bersama', kategori_usaha: 'Pasar' as const, alamat: 'Kelurahan Makassar Barat, Ternate Tengah', kontak_hp: '082155443322', latitude: 0.786789, longitude: 127.379456 },
  ]
  await prisma.profilMitra.createMany({ data: profilMitras })
  console.log('Profil Mitra seeded.')

  // 5. Komoditas Asli
  const komoditas = [
    { id_komoditas: 1, nama_pangan: 'Beras', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 2, nama_pangan: 'Jagung', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 4, nama_pangan: 'Bawang Putih', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 5, nama_pangan: 'Cabe Besar', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 6, nama_pangan: 'Cabe Rawit', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 7, nama_pangan: 'Daging Sapi', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 8, nama_pangan: 'Daging Ayam', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 9, nama_pangan: 'Telur', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 10, nama_pangan: 'Gula Pasir', satuan: 'Kg', icon_map: 'default.png' },
    { id_komoditas: 11, nama_pangan: 'Minyak Goreng', satuan: 'Liter', icon_map: 'default.png' },
    { id_komoditas: 12, nama_pangan: 'Beras Bulog', satuan: 'Kg', icon_map: 'default.png' },
  ]
  await prisma.msKomoditas.createMany({ data: komoditas })
  console.log('Komoditas seeded.')

  // 6. Transaksi Pangan Historis Asli
  const transaksi = [
    { id_mitra: 1, id_komoditas: 2, jumlah_stok: 2868, harga_jual: 8388, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 4, jumlah_stok: 4224, harga_jual: 35082, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 5, jumlah_stok: 903, harga_jual: 58009, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 6, jumlah_stok: 427, harga_jual: 63620, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 7, jumlah_stok: 2442, harga_jual: 129303, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 8, jumlah_stok: 3895, harga_jual: 38966, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 9, jumlah_stok: 1022, harga_jual: 30452, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 10, jumlah_stok: 2987, harga_jual: 17076, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 11, jumlah_stok: 213, harga_jual: 21457, tanggal_input: new Date('2025-12-21'), input_by: 1 },
    { id_mitra: 1, id_komoditas: 1, jumlah_stok: 50, harga_jual: 20000, tanggal_input: new Date('2025-12-21'), input_by: 3 },
    { id_mitra: 1, id_komoditas: 2, jumlah_stok: 25, harga_jual: 12000, tanggal_input: new Date('2025-12-21'), input_by: 3 },
    { id_mitra: 3, id_komoditas: 2, jumlah_stok: 12, harga_jual: 5400, tanggal_input: new Date('2025-12-21'), input_by: 8 },
    { id_mitra: 3, id_komoditas: 1, jumlah_stok: 14, harga_jual: 15400, tanggal_input: new Date('2025-12-21'), input_by: 8 },
    { id_mitra: 3, id_komoditas: 2, jumlah_stok: 20, harga_jual: 5400, tanggal_input: new Date('2025-12-21'), input_by: 8 },
    { id_mitra: 5, id_komoditas: 1, jumlah_stok: 15, harga_jual: 5500, tanggal_input: new Date('2025-12-21'), input_by: 4 },
    { id_mitra: 5, id_komoditas: 6, jumlah_stok: 21, harga_jual: 21000, tanggal_input: new Date('2025-12-21'), input_by: 4 },
    { id_mitra: 8, id_komoditas: 1, jumlah_stok: 15, harga_jual: 15000, tanggal_input: new Date('2025-12-22'), input_by: 14 },
    { id_mitra: 8, id_komoditas: 9, jumlah_stok: 50, harga_jual: 35000, tanggal_input: new Date('2025-12-22'), input_by: 14 },
    { id_mitra: 5, id_komoditas: 5, jumlah_stok: 70, harga_jual: 20000, tanggal_input: new Date('2025-12-26'), input_by: 4 },
    { id_mitra: 5, id_komoditas: 1, jumlah_stok: 50, harga_jual: 40000, tanggal_input: new Date('2025-12-26'), input_by: 4 },
    { id_mitra: 5, id_komoditas: 6, jumlah_stok: 100, harga_jual: 3500, tanggal_input: new Date('2025-12-26'), input_by: 4 },
    { id_mitra: 5, id_komoditas: 10, jumlah_stok: 50, harga_jual: 10000, tanggal_input: new Date('2025-12-26'), input_by: 4 },
    { id_mitra: 1, id_komoditas: 8, jumlah_stok: 50, harga_jual: 30000, tanggal_input: new Date('2025-12-27'), input_by: 3 },
    { id_mitra: 13, id_komoditas: 2, jumlah_stok: 116, harga_jual: 42594, tanggal_input: new Date('2026-02-03'), input_by: 19 },
    { id_mitra: 13, id_komoditas: 5, jumlah_stok: 397, harga_jual: 16521, tanggal_input: new Date('2026-02-03'), input_by: 19 },
    { id_mitra: 14, id_komoditas: 1, jumlah_stok: 392, harga_jual: 13231, tanggal_input: new Date('2026-02-03'), input_by: 20 },
    { id_mitra: 14, id_komoditas: 2, jumlah_stok: 92, harga_jual: 36511, tanggal_input: new Date('2026-02-03'), input_by: 20 },
    { id_mitra: 14, id_komoditas: 4, jumlah_stok: 465, harga_jual: 29103, tanggal_input: new Date('2026-02-03'), input_by: 20 },
    { id_mitra: 14, id_komoditas: 5, jumlah_stok: 353, harga_jual: 17971, tanggal_input: new Date('2026-02-03'), input_by: 20 },
    { id_mitra: 15, id_komoditas: 1, jumlah_stok: 99, harga_jual: 13217, tanggal_input: new Date('2026-02-03'), input_by: 21 },
    { id_mitra: 15, id_komoditas: 2, jumlah_stok: 312, harga_jual: 46386, tanggal_input: new Date('2026-02-03'), input_by: 21 },
    { id_mitra: 15, id_komoditas: 4, jumlah_stok: 345, harga_jual: 28983, tanggal_input: new Date('2026-02-03'), input_by: 21 },
  ]

  // Modify `tanggal_input` for some to be TODAY so they appear in /pangan as Live Data
  const today = new Date()
  for (let i = 0; i < 15; i++) {
    transaksi[i].tanggal_input = today
  }

  await prisma.transaksiPangan.createMany({ data: transaksi })
  console.log('Transaksi Pangan seeded.')

  // 7. Stok Pangan Bulanan Asli
  const stokData = JSON.parse(fs.readFileSync('./prisma/stok_data.json', 'utf-8'))
  await prisma.stokPanganBulanan.createMany({ data: stokData })
  console.log('Stok Bulanan seeded.')

  // 8. Berita Asli (dengan placeholder image agar tidak error jika image lama tidak ada di repo ini)
  const berita = [
    {
      judul: 'Pasokan Hortikultura Melimpah, Dinas Pangan Ternate Pastikan Harga Sayuran Stabil Jelang Akhir Tahun',
      slug: 'pasokan-hortikultura-melimpah-dinas-pangan-ternate-pastikan-harga-sayuran-stabil-jelang-akhir-tahun',
      isi: 'Ternate, 27 Desember 2025 – Dinas Ketahanan Pangan Kota Ternate kembali melakukan pemantauan rutin terhadap ketersediaan pangan strategis, khususnya komoditas hortikultura seperti cabai, tomat, dan sayuran hijau di sejumlah pasar tradisional utama.\n\nBerdasarkan data yang dihimpun melalui sistem SIKEPANG pagi ini, pasokan sayuran segar terpantau melimpah. Kepala Dinas Ketahanan Pangan menyampaikan bahwa kelancaran distribusi dari sentra produksi lokal maupun pasokan yang masuk melalui pelabuhan berjalan tanpa hambatan, meskipun kondisi cuaca di akhir tahun seringkali tidak menentu.',
      penulis: 'admin_dinas',
      gambar: 'IMG_8588.png', // Fallback to our dummy generated images that exist in public folder
      created_at: new Date('2025-12-27T06:45:37Z'),
    },
    {
      judul: 'Dinas Ketpang Kota Ternate Gagas Inovasi Pembuatan Sagu Ternate',
      slug: 'dinas-ketpang-kota-ternate-gagas-inovasi-pembuatan-sagu-ternate',
      isi: 'Dinas Ketahanan Pangan (Ketpang) Kota Ternate membuat inovasi baru dari makanan khas Maluku Utara (Malut) yaitu Sagu Ternate atau Huda Teranoate (Hunoet).\n\nAdapun bahan dari pembuatan hunoet yaitu tepung kasbi, ikan fufu atau ikan tuna asap, wortel, kentang, daun bawang, daun seledri, garam, gula, dan penyedap rasa.\n\nPelaksana tugas (Plt) Kepala Ketpang Kota Ternate, Muhamad Hartono mengatakan potensi kekayaan pangan lokal Malut yang cukup besar dan kontribusi dalam mendukung ketahanan pangan yang masih rendah maka dibuatlah inovasi baru dari pangan lokal dengan bahan dasar sagu.',
      penulis: 'admin_dinas',
      gambar: 'IMG_8589.png', // Fallback
      created_at: new Date('2025-12-27T06:47:31Z'),
    }
  ]
  await prisma.berita.createMany({ data: berita })
  console.log('Berita seeded.')

  // 8. Fix PostgreSQL sequences because we used explicit IDs for users, admins, mitras, komoditas
  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id_user'), coalesce(max(id_user),0) + 1, false) FROM "User";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"ProfilAdmin"', 'id_admin'), coalesce(max(id_admin),0) + 1, false) FROM "ProfilAdmin";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"ProfilMitra"', 'id_mitra'), coalesce(max(id_mitra),0) + 1, false) FROM "ProfilMitra";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"MsKomoditas"', 'id_komoditas'), coalesce(max(id_komoditas),0) + 1, false) FROM "MsKomoditas";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"TransaksiPangan"', 'id_transaksi'), coalesce(max(id_transaksi),0) + 1, false) FROM "TransaksiPangan";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"StokPanganBulanan"', 'id'), coalesce(max(id),0) + 1, false) FROM "StokPanganBulanan";`)
    console.log('PostgreSQL sequences updated successfully.')
  } catch (e) {
    console.warn('Could not update sequences, this might be SQLite or another DB.', e)
  }

  console.log('Migrasi Data Asli Selesai!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
