import {
  CreditCardOutlined,
  SolutionOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import Link from "next/link"

type MenuItem = Required<MenuProps>["items"][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

//prettier-ignore
export const items: MenuItem[] = [
  getItem("Penjualan", "penjualan", <CreditCardOutlined />, [
    getItem(<Link href="/penjualan/overview">Overview</Link>, "Overview", <SolutionOutlined />),
    getItem(<Link href="/penjualan/tagihan">Tagihan</Link>, "Tagihan", <CreditCardOutlined />),
    getItem(<Link href="/penjualan/pengiriman">Pengiriman</Link>, "Pengiriman", <ThunderboltOutlined />),
    getItem(<Link href="/penjualan/pemesanan">Pemesanan</Link>, "Pemesanan", <HomeOutlined />),
  ]),
  getItem(<Link href="/biaya">Biaya</Link>, "Biaya", <PieChartOutlined />),
  getItem(<Link href="/produk">Produk</Link>, "Produk", <ShopOutlined />),
  { type: "divider" },
  getItem(<Link href="/kontak">Kontak</Link>, "Kontak", <PhoneOutlined />),
  { type: "divider" },
  // getItem(<Link href="/master/cabang">Cabang</Link>, "Cabang", <PartitionOutlined />,),
  // getItem(<Link href="/master/pelanggan">Pelanggan</Link>, "Pelanggan", <TeamOutlined />,),
  // getItem( <Link href="/master/aset">Aset</Link>, "Aset", <FolderOpenOutlined />,),
  // getItem(<Link href="/master/transaksi">Transaksi</Link>, "transaksi", <CreditCardOutlined />,
  //   [
  //     getItem(<Link href="/master/transaksi/sewa">Sewa</Link>, "Sewa", <SolutionOutlined />,),
  //     getItem(<Link href="/master/transaksi/listrik">Listrik</Link>, "Listrik", <ThunderboltOutlined />,),
  //     getItem(<Link href="/master/transaksi/ipl">IPL</Link>, "IPL", <HomeOutlined />,),
  //   ],
  // ),
  // getItem(<Link href="/master/laporan">Laporan</Link>, "Laporan", <InsertRowLeftOutlined />,),
  // getItem(<Link href="/master/other">Lain-Lain</Link>, "Tipe Aset & Sertifikat", <BuildOutlined />,),
]
