import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 10, marginBottom: 20, textAlign: 'center', color: '#666' },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0', padding: 5 },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  cellHeader: { fontSize: 10, fontWeight: 'bold' },
  cell: { fontSize: 10 }
});

const PdfDocument = ({ data, lokasi }: { data: any[], lokasi: string }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Laporan Harga & Stok Pangan</Text>
      <Text style={styles.subtitle}>Sistem Informasi Ketahanan Pangan (SiKepang) - Kota Ternate</Text>
      
      <Text style={{ marginBottom: 5, fontSize: 10 }}>Filter Lokasi: {lokasi === 'rata_rata' ? 'Rekapitulasi Rata-Rata Kota' : lokasi || 'Semua Data'}</Text>
      <Text style={{ marginBottom: 15, fontSize: 10 }}>Dicetak pada: {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Komoditas</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Stok Tersedia</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Harga Jual</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Sumber / Lokasi</Text></View>
        </View>
        {data.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}><Text style={styles.cell}>{item.nama_pangan}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>{item.jumlah_stok.toLocaleString('id-ID')} {item.satuan}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>Rp {item.harga_jual.toLocaleString('id-ID')}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>{item.nama_usaha}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || '';
    const lokasi = searchParams.get('lokasi') || '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const transactions = await prisma.transaksiPangan.findMany({
      where: {
        tanggal_input: { gte: today },
        komoditas: {
          nama_pangan: { contains: keyword, mode: 'insensitive' }
        },
        mitra: lokasi && lokasi !== 'rata_rata' ? {
          ...(lokasi === 'Pasar' ? { kategori_usaha: 'Pasar' } : 
             lokasi === 'UD' ? { kategori_usaha: 'Distributor' } : 
             { nama_usaha: { contains: lokasi, mode: 'insensitive' } })
        } : undefined
      },
      include: {
        komoditas: true,
        mitra: true
      },
      orderBy: {
        tanggal_input: 'desc'
      }
    });

    let data: any[] = [];
    
    if (lokasi === 'rata_rata') {
      const grouped = transactions.reduce((acc: any, curr) => {
        if (!acc[curr.id_komoditas]) {
          acc[curr.id_komoditas] = {
            nama_pangan: curr.komoditas.nama_pangan,
            satuan: curr.komoditas.satuan,
            total_harga: 0,
            total_stok: 0,
            count: 0,
          }
        }
        acc[curr.id_komoditas].total_harga += curr.harga_jual;
        acc[curr.id_komoditas].total_stok += curr.jumlah_stok;
        acc[curr.id_komoditas].count += 1;
        return acc;
      }, {});
      
      data = Object.values(grouped).map((g: any) => ({
        nama_pangan: g.nama_pangan,
        satuan: g.satuan,
        harga_jual: Math.round(g.total_harga / g.count),
        jumlah_stok: g.total_stok,
        nama_usaha: 'Gabungan',
      }));
    } else {
      data = transactions.map(t => ({
        nama_pangan: t.komoditas.nama_pangan,
        satuan: t.komoditas.satuan,
        harga_jual: t.harga_jual,
        jumlah_stok: t.jumlah_stok,
        nama_usaha: t.mitra.nama_usaha || t.mitra.kategori_usaha,
      }));

      // Remove duplicates
      const uniqueMap = new Map();
      data.forEach(item => {
        const key = `${item.nama_pangan}-${item.nama_usaha}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });
      data = Array.from(uniqueMap.values());
    }

    const stream = await renderToStream(<PdfDocument data={data} lokasi={lokasi} />);

    return new Response(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="laporan_sikepang.pdf"',
      }
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Gagal membuat PDF' }, { status: 500 });
  }
}
