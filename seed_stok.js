const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sql = fs.readFileSync('./db/sikepang_db.sql', 'utf-8');
  const lines = sql.split('\n');
  let valuesString = '';
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('INSERT INTO `stok_pangan_bulanan`')) {
      for (let j = i + 1; j < lines.length; j++) {
        valuesString += lines[j];
        if (lines[j].includes(';')) break;
      }
      break;
    }
  }

  // Parse the SQL values into JSON objects
  // Example: (1, 'BERAS', 'Dinas Ketpang', 1, '2025', 2518.000, 0.000, '2025-12-22 01:02:20', '2025-12-22 01:02:20'),
  const regex = /\((\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'(\d+)',\s*([\d.]+),\s*([\d.]+),\s*'[^']+',\s*'[^']+'\)/g;
  let match;
  const records = [];
  
  while ((match = regex.exec(valuesString)) !== null) {
    records.push({
      id: BigInt(match[1]),
      nama_komoditas: match[2],
      kategori_dinas: match[3],
      bulan: parseInt(match[4], 10),
      tahun: parseInt(match[5], 10),
      stok_masuk_ton: parseFloat(match[6]),
      stok_keluar_ton: parseFloat(match[7])
    });
  }

  console.log(`Found ${records.length} records for stok_pangan_bulanan`);
  
  if (records.length > 0) {
    await prisma.stokPanganBulanan.deleteMany();
    await prisma.stokPanganBulanan.createMany({ data: records });
    console.log('Successfully seeded stokPanganBulanan');
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
