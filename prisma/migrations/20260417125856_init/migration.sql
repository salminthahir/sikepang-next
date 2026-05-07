-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin_dinas', 'mitra');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('aktif', 'nonaktif');

-- CreateEnum
CREATE TYPE "KategoriUsaha" AS ENUM ('Distributor', 'Penyosoh', 'Pasar', 'Petani');

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nama_lengkap" TEXT,
    "foto_profil" TEXT DEFAULT 'default.jpg',
    "status" "UserStatus" NOT NULL DEFAULT 'aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "ProfilMitra" (
    "id_mitra" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "nama_usaha" TEXT,
    "kategori_usaha" "KategoriUsaha" NOT NULL DEFAULT 'Pasar',
    "alamat" TEXT,
    "kontak_hp" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "last_update" TIMESTAMP(3),

    CONSTRAINT "ProfilMitra_pkey" PRIMARY KEY ("id_mitra")
);

-- CreateTable
CREATE TABLE "ProfilAdmin" (
    "id_admin" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "nama_lengkap" TEXT,
    "no_hp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilAdmin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "MsKomoditas" (
    "id_komoditas" SERIAL NOT NULL,
    "nama_pangan" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "icon_map" TEXT DEFAULT 'default.png',

    CONSTRAINT "MsKomoditas_pkey" PRIMARY KEY ("id_komoditas")
);

-- CreateTable
CREATE TABLE "TransaksiPangan" (
    "id_transaksi" BIGSERIAL NOT NULL,
    "id_mitra" INTEGER NOT NULL,
    "id_komoditas" INTEGER NOT NULL,
    "jumlah_stok" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "harga_jual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tanggal_input" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input_by" INTEGER NOT NULL,

    CONSTRAINT "TransaksiPangan_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateTable
CREATE TABLE "StokPanganBulanan" (
    "id" BIGSERIAL NOT NULL,
    "nama_komoditas" TEXT NOT NULL,
    "kategori_dinas" TEXT NOT NULL DEFAULT 'Dinas Ketpang',
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "stok_masuk_ton" DECIMAL(15,3) NOT NULL,
    "stok_keluar_ton" DECIMAL(15,3) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "StokPanganBulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotifikasiSistem" (
    "id" BIGSERIAL NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'info',
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "waktu" TIMESTAMP(3),
    "is_read" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NotifikasiSistem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL DEFAULT '0.0.0.0',
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Success',
    "created_at" TIMESTAMP(3),

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gambar" TEXT,
    "penulis" TEXT NOT NULL DEFAULT 'Admin',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilMitra_id_user_key" ON "ProfilMitra"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilAdmin_id_user_key" ON "ProfilAdmin"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- AddForeignKey
ALTER TABLE "ProfilMitra" ADD CONSTRAINT "ProfilMitra_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilAdmin" ADD CONSTRAINT "ProfilAdmin_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiPangan" ADD CONSTRAINT "TransaksiPangan_id_mitra_fkey" FOREIGN KEY ("id_mitra") REFERENCES "ProfilMitra"("id_mitra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiPangan" ADD CONSTRAINT "TransaksiPangan_id_komoditas_fkey" FOREIGN KEY ("id_komoditas") REFERENCES "MsKomoditas"("id_komoditas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiPangan" ADD CONSTRAINT "TransaksiPangan_input_by_fkey" FOREIGN KEY ("input_by") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
