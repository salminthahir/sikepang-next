import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#198754', paddingBottom: 15, marginBottom: 20 },
  logo: { width: 50, height: 50, marginRight: 15 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#666666' },
  infoSection: { marginBottom: 20, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 4 },
  infoText: { fontSize: 10, color: '#333333', marginBottom: 4 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tableRowEven: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  tableColHeader: { width: '25%', padding: 8, backgroundColor: '#155724' },
  tableCol: { width: '25%', padding: 8 },
  cellHeader: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' },
  cell: { fontSize: 10, color: '#1f2937' },
  cellBold: { fontSize: 10, fontWeight: 'bold', color: '#198754' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }
});

const PdfDocument = ({ data, lokasi, origin }: { data: any[], lokasi: string, origin: string }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image src={`${origin}/logo/image.png`} style={styles.logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Laporan Harga & Stok Pangan</Text>
          <Text style={styles.subtitle}>Sistem Informasi Ketahanan Pangan (SiKepang) - Kota Ternate</Text>
        </View>
      </View>
      
      {/* Document Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Filter Lokasi : {lokasi === 'rata_rata' ? 'Rekapitulasi Rata-Rata Kota' : lokasi || 'Semua Data'}</Text>
        <Text style={styles.infoText}>Dicetak pada : {new Date().toLocaleDateString('id-ID')} - {new Date().toLocaleTimeString('id-ID')}</Text>
        <Text style={styles.infoText}>Total Data   : {data.length} Entri</Text>
      </View>
      
      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Komoditas</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Stok Tersedia</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Harga Jual</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cellHeader}>Sumber / Lokasi</Text></View>
        </View>
        
        {/* Table Body */}
        {data.map((item, i) => (
          <View style={i % 2 === 0 ? styles.tableRow : styles.tableRowEven} key={i}>
            <View style={styles.tableCol}><Text style={styles.cellBold}>{item.nama_pangan}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>{item.jumlah_stok.toLocaleString('id-ID')} {item.satuan}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellBold}>Rp {item.harga_jual.toLocaleString('id-ID')}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>{item.nama_usaha}</Text></View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer} fixed>
        Dokumen ini di-generate secara otomatis oleh Sistem Informasi Ketahanan Pangan (SiKepang) Kota Ternate.
      </Text>
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

    const origin = req.nextUrl.origin;
    const stream = await renderToStream(<PdfDocument data={data} lokasi={lokasi} origin={origin} />);

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
