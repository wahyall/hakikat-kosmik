"use client";

/**
 * ReflectionMode.tsx — Mode Refleksi / Kuis Pemahaman Mendalam.
 *
 * 20 pertanyaan refleksi tingkat lanjut yang menguji pemahaman pembaca terhadap:
 *   - Metafisika Islam: Ibnu Sina (Wajib vs Mumkin, Burhan al-Siddiqin), Al-Ghazali (Silsilah Hawadith, Tasalsul, Iqtarān), Mulla Sadra (Asalat al-Wujud), Al-Razi
 *   - Filsafat Komparatif: Thomas Aquinas (Sebab Per Se vs Per Accidens), Leibniz (Prinsip Alasan Yang Cukup / PSR)
 *   - Kosmologi & Fisika Modern: Batas Era Planck, Entropi Penrose (10^10^123), Fine-Tuning Konstanta Kosmologis, Kritik Multiverse & Gambler's Fallacy
 *   - Teori Kausalitas & Determinisme: Laplace's Demon vs Ketidakpastian Kuantum, Vakum Kuantum vs 'Adam Mahd
 *   - Epistemologi & Integrasi Wahyu: Ma'lumat as-Sabiqah, Kontingensi Biologis, Sintesis Qur'ani dengan Akal Rasional
 */

import { useFlowStore } from "@/store/flow-store";
import { useState } from "react";
import { X, Brain, Check, X as XIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "Menurut Ibnu Sina dalam Burhan al-Siddiqin, mengapa status ontologis alam semesta sebagai mumkin al-wujud secara logis menuntut adanya Wajib al-Wujud, terlepas dari apakah alam berawal atau kekal?",
    options: [
      {
        id: "a",
        text: "Karena segala yang mumkin esensinya netral terhadap ada/tidak-ada, sehingga membutuhkan murajjih (faktor penentu) luar yang wajib dengan sendirinya untuk mengaktualisasikannya.",
      },
      {
        id: "b",
        text: "Karena alam semesta selalu berawal dari waktu t=0, dan segala yang berawal waktu wajib diciptakan oleh sebab material.",
      },
      {
        id: "c",
        text: "Karena esensi mumkin al-wujud mengandung kontradiksi internal yang membuatnya harus dimusnahkan terlebih dahulu sebelum diwujudkan.",
      },
      {
        id: "d",
        text: "Karena Ibnu Sina menolak adanya hukum kausalitas di alam nyata sehingga semua kejadian membutuhkan mukjizat konstan.",
      },
    ],
    correctId: "a",
    explanation:
      "Bagi Ibnu Sina, esensi mumkin al-wujud bersifat seimbang antara ada (wujud) dan tiada ('adam). Karena tidak bisa memprioritaskan keberadaan atas dirinya sendiri tanpa kontradiksi (tarjih bila murajjih), dibutuhkan penentu (murajjih/mujib) yang Wajib al-Wujud. Argumen ini bekerja secara ontologis, bukan temporal.",
  },
  {
    id: 2,
    prompt:
      "Al-Ghazali menolak konsep tasalsul (deret sebab-akibat tak terhingga ke belakang / silsilah al-hawadith) dengan argumen logika perlintasan (traversal). Manakah rumusan berikut yang paling akurat?",
    options: [
      {
        id: "a",
        text: "Tak terhingga aktual tidak dapat diselesaikan atau dilalui (traversed) step-by-step; jika deret masa lalu tak terhingga, momen masa kini tidak akan pernah tercapai.",
      },
      {
        id: "b",
        text: "Tak terhingga fisik dilarang oleh hukum kedua termodinamika karena energi alam akan habis dalam rentang 100 miliar tahun.",
      },
      {
        id: "c",
        text: "Al-Ghazali menolak tasalsul hanya karena teks kitab suci melarang penggunaan matematika tak terhingga dalam filsafat.",
      },
      {
        id: "d",
        text: "Deret tak terhingga boleh ada di masa lalu, namun harus berhenti ketika partikel subatomik terbentuk.",
      },
    ],
    correctId: "a",
    explanation:
      "Al-Ghazali berargumen bahwa untuk sampai ke titik masa kini, deret masa lalu harus sudah selesai dilalui. Jika masa lalu terdiri dari jumlah kejadian tak terhingga secara aktual, deret tersebut tidak pernah selesai dilalui, sehingga masa kini takkan pernah tercapai. Adanya masa kini membuktikan deret masa lalu terhingga dan berawal dari Sebab Pertama.",
  },
  {
    id: 3,
    prompt:
      "Mengapa argumen kosmologis para pemikir Islam menyimpulkan bahwa Wajib al-Wujud harus bersifat Ahad (Esa Mutlak / Basit), bukan sekadar Wahid (Satu dalam hitungan)?",
    options: [
      {
        id: "a",
        text: "Karena angka 'satu' (wahid) bisa digandakan dalam matematika, sedangkan 'ahad' adalah istilah linguistik lokal bangsa Arab.",
      },
      {
        id: "b",
        text: "Karena sesuatu yang tersusun dari bagian-bagian (murakkab) bergantung pada bagian-bagiannya; ketergantungan ini menjadikannya mumkin, sedangkan Wajib al-Wujud harus bebas dari penyusunan internal apapun.",
      },
      {
        id: "c",
        text: "Karena entitas yang wahid berada dalam ruang 3 dimensi, sementara entitas yang ahad hidup di dimensi ke-11 superstring.",
      },
      {
        id: "d",
        text: "Karena konsep ahad hanya berlaku pada hukum mekanika kuantum skala mikroskopis.",
      },
    ],
    correctId: "b",
    explanation:
      "Jika Wajib al-Wujud tersusun dari bagian-bagian (turkib), Ia akan bergantung pada keberadaan bagian-bagian penyusunnya. Sesuatu yang bergantung adalah mumkin al-wujud. Maka Wajib al-Wujud harus sederhana (basit) tanpa komposisi esensi-eksistensi maupun bagian-bagian (Ahad). Ini selaras dengan QS Al-Ikhlas:1.",
  },
  {
    id: 4,
    prompt:
      "Apakah keunggulan metodologis utama dari Burhan al-Siddiqin (Ibnu Sina) jika dibandingkan dengan Kalam Cosmological Argument (Al-Ghazali/Craig)?",
    options: [
      {
        id: "a",
        text: "Argumen Ibnu Sina membuktikan bahwa alam semesta tidak diciptakan melainkan ada secara kebetulan dari materi gelap.",
      },
      {
        id: "b",
        text: "Argumen Ibnu Sina beroperasi pada tingkat kebutuhan ontologis wujud, sehingga validitasnya tidak bergantung pada apakah fisika membuktikan alam berawal (Big Bang) atau kekal tanpa awal.",
      },
      {
        id: "c",
        text: "Argumen Ibnu Sina menggunakan persamaan kalkulus diferensial yang lebih presisi daripada logika kalam.",
      },
      {
        id: "d",
        text: "Argumen Al-Ghazali hanya berlaku untuk zat cair, sedangkan Ibnu Sina berlaku untuk zat padat.",
      },
    ],
    correctId: "b",
    explanation:
      "Kalam Cosmological Argument sangat bergantung pada premis 'Alam semesta memiliki permulaan waktu' (yang terus diperdebatkan dalam model fisika kuantum/multiverse). Sebaliknya, Burhan al-Siddiqin berargumen dari kontingensi eksistensi: bahkan jika alam diposisikan ada tanpa awal, alam tetap bersifat mumkin dan membutuhkan Wajib al-Wujud pada setiap momen.",
  },
  {
    id: 5,
    prompt:
      "Mengapa momen t = 10^-43 detik (Era Planck) ditandai sebagai Boundary Node (Batas Sains), dan bukan sebagai bukti empiris langsung tentang tindakan penciptaan?",
    options: [
      {
        id: "a",
        text: "Karena pada t < 10^-43 detik, suhu alam sangat dingin sehingga teleskop tidak dapat menangkap sinyal radio.",
      },
      {
        id: "b",
        text: "Karena pada skala Planck, relativitas umum dan mekanika kuantum belum tersatukan, sehingga sains konvensional kehilangan daya prediksinya dan klaim tentang t=0 menjadi ranah metafisika/filsafat.",
      },
      {
        id: "c",
        text: "Karena ilmuwan sains sepakat bahwa sains tidak boleh membahas topik asal-usul alam semesta.",
      },
      {
        id: "d",
        text: "Karena Era Planck adalah peristiwa fisik yang hanya terjadi di galaksi Andromeda.",
      },
    ],
    correctId: "b",
    explanation:
      "Era Planck (t ≈ 10^-43 s) adalah batas jujur epistemologi sains empiris modern. Relativitas Umum Einstein runtuh pada skala kuantum ini. Oleh karena itu, klaim tentang 'sebelum' atau 'pada saat' Big Bang melampaui batas observasi empiris dan memasuki wilayah inferensi rasional/metafisis.",
  },
  {
    id: 6,
    prompt:
      "Dalam filsafat skolastik (Thomas Aquinas) dan komparatif Islam, mengapa regresi sebab-akibat yang disusun per se (secara esensial/simultan) mustahil berlangsung tak terhingga?",
    options: [
      {
        id: "a",
        text: "Karena sebab per se bergantung pada waktu, sedangkan sebab per accidens bekerja secara instan.",
      },
      {
        id: "b",
        text: "Dalam rantai per se, kekuatan kausal setiap elemen perantara dipinjam secara simultan dari Sebab Utama; tanpa Sebab Pertama, tidak ada elemen perantara yang memiliki daya kausal.",
      },
      {
        id: "c",
        text: "Sebab per accidens hanya terjadi pada benda-benda biologis, sedangkan per se pada benda astronomis.",
      },
      {
        id: "d",
        text: "Karena Aquinas menganggap sebab per se sebagai ilusi optik yang disebabkan oleh atmosfer bumi.",
      },
    ],
    correctId: "b",
    explanation:
      "Rantai per se (seperti tangan menggerakkan tongkat, tongkat menggerakkan batu) adalah ketergantungan kausal simultan. Jika tidak ada tangan (Sebab Pertama), tongkat tak memiliki daya gerak sedikit pun. Alam semesta membutuhkan Sebab Pertama per se yang menopang keberadaannya saat ini.",
  },
  {
    id: 7,
    prompt:
      "Bagaimana Prinsip Alasan Yang Cukup (Principle of Sufficient Reason / PSR) dari Leibniz diterapkan untuk membuktikan keberadaan Tuhan?",
    options: [
      {
        id: "a",
        text: "Karena setiap fakta kontingen di alam semesta membutuhkan penjelasan di luar dirinya; totalitas fakta kontingen (alam semesta) tidak bisa menjelaskan dirinya sendiri, sehingga penjelas akhirnya harus berupa Necessary Being (Wajib al-Wujud).",
      },
      {
        id: "b",
        text: "PSR membuktikan bahwa alam semesta menciptakan dirinya sendiri melalui fluktuasi vakum kuantum spontan.",
      },
      {
        id: "c",
        text: "PSR menyatakan bahwa hanya fakta matematis yang butuh penjelasan, sedangkan fakta fisik terjadi tanpa sebab.",
      },
      {
        id: "d",
        text: "PSR adalah hukum fisika yang mengatur percepatan partikel di dalam akselerator CERN.",
      },
    ],
    correctId: "a",
    explanation:
      "Leibniz menegaskan bahwa meskipun kita dapat menjelaskan suatu fakta kontingen dengan fakta kontingen sebelumnya, penjelasan lengkap tentang mengapa ada alam semesta sama sekali daripada tidak ada apa-apa harus berada di luar rantai benda kontingen tersebut, yaitu pada Necessary Being (Wajib al-Wujud).",
  },
  {
    id: 8,
    prompt:
      "Roger Penrose menghitung bahwa keadaan awal entropi saat Big Bang harus diatur dengan kepresisian ekstrem sebesar 1 dibanding 10^(10^123). Mengapa fakta ini menjadi tantangan besar bagi penjelasan materialistis murni?",
    options: [
      {
        id: "a",
        text: "Karena angka tersebut menunjukkan bahwa alam semesta pasti runtuh kembali dalam hitungan detik setelah Big Bang.",
      },
      {
        id: "b",
        text: "Karena secara statistik, keadaan acak berentropi tinggi jauh lebih mungkin terjadi; tingkat kepresisian entropi serendah itu menunjukkan penataan kondisi awal (special initial state) yang terarah.",
      },
      {
        id: "c",
        text: "Karena Hukum II Termodinamika tidak berlaku di ruang hampa udara.",
      },
      {
        id: "d",
        text: "Karena entropi yang rendah berarti hukum gravitasi tidak bekerja pada masa awal kosmos.",
      },
    ],
    correctId: "b",
    explanation:
      "Penrose menyoroti bahwa rasio ruang fase awal alam semesta sangat kecil (1 / 10^(10^123)). Keadaan entropi yang sangat rendah ini secara statistik hampir mustahil terjadi secara acak murni, menuntut adanya penataan kondisi awal (Fine-Tuner) untuk memungkinkan kosmos yang teratur.",
  },
  {
    id: 9,
    prompt:
      "Jika nilai Konstanta Kosmologis (Lambda) disimpangkan hanya sebesar 1 bagian dari 10^120, apa dampak fisik mendasar terhadap kosmos?",
    options: [
      {
        id: "a",
        text: "Alam semesta akan langsung runtuh kembali (Big Crunch) atau memuai terlalu cepat sehingga atom tidak pernah sempat bergabung membentuk bintang dan galaksi.",
      },
      {
        id: "b",
        text: "Gaya gravitasi akan berubah menjadi gaya magnetik di semua planet secara serentak.",
      },
      {
        id: "c",
        text: "Matahari akan terbakar 10 kali lebih cepat tetapi tidak memengaruhi planet Bumi.",
      },
      {
        id: "d",
        text: "Nilai Lambda tidak memiliki efek fisik apapun karena merupakan angka fiktif dalam rumus Einstein.",
      },
    ],
    correctId: "a",
    explanation:
      "Fine-tuning konstanta kosmologis (Lambda) memiliki toleransi ekstrem 1 banding 10^120. Jika Lambda lebih besar sedikit saja, kosmos mengalami ekspansi eksplosif tanpa bintang/galaksi. Jika lebih kecil sedikit saja, kosmos langsung mengalami Big Crunch seketika.",
  },
  {
    id: 10,
    prompt:
      "Kritik filosofis utama terhadap hipotesis Multiverse untuk menjelaskan Fine-Tuning tanpa Pencipta adalah Inverse Gambler's Fallacy. Manakah dari berikut yang menjelaskan kekeliruan logika tersebut?",
    options: [
      {
        id: "a",
        text: "Asumsi salah bahwa keberadaan penjudi lain di meja sebelah mengubah peluang lemparan dadu di meja kita — keberadaan alam semesta lain tidak menjelaskan mengapa alam semesta ini memiliki fine-tuning.",
      },
      {
        id: "b",
        text: "Menganggap bahwa dadu yang dilempar 100 kali pasti akan selalu menghasilkan angka 6.",
      },
      {
        id: "c",
        text: "Menolak bahwa alam semesta kita memiliki hukum fisika sama sekali.",
      },
      {
        id: "d",
        text: "Mengasumsikan bahwa penjudi selalu menang jika bertaruh di galaksi lain.",
      },
    ],
    correctId: "a",
    explanation:
      "Inverse Gambler's Fallacy (Hacking & White): Melihat lemparan dadu langka di meja ini lalu berasumsi ada jutaan meja lain tidak menjelaskan mengapa meja ini menghasilkan angka tersebut. Selain itu, pembuat multiverse (multiverse generator) sendiri membutuhkan fine-tuning, sehingga hanya menunda masalah kausalitas.",
  },
  {
    id: 11,
    prompt:
      "Dalam Tahafut al-Falasifah (Mas'alah 17), Al-Ghazali mendefinisikan hubungan sebab-akibat (seperti api dan kapas) sebagai hubungan iqtiran (keteriringan), bukan keharusan rasional mutlak. Apa implikasinya?",
    options: [
      {
        id: "a",
        text: "Api memiliki kehendak bebas untuk memilih apakah ingin membakar kapas atau tidak.",
      },
      {
        id: "b",
        text: "Hubungan kausal fisik adalah kebiasaan ('adah) yang ditetapkan Allah; api tidak memiliki daya kausal mandiri, sehingga mukjizat secara rasional mungkin terjadi (mumkin).",
      },
      {
        id: "c",
        text: "Al-Ghazali menolak sains modern dan menganggap dunia fisik adalah ilusi maya murni.",
      },
      {
        id: "d",
        text: "Kapas dan api adalah benda yang sama menurut analisis atomik Ash'ariyah.",
      },
    ],
    correctId: "b",
    explanation:
      "Al-Ghazali menegaskan observasi fisik hanya melihat keteriringan (iqtiran), bukan keharusan intrinsik. Kausalitas sejati berada pada Kehendak Ilahi yang menetapkan keteraturan alam ('adatuLlah). Ini menjaga keabsahan pengamatan sains sekaligus memberi ruang rasional bagi kemungkinan mukjizat.",
  },
  {
    id: 12,
    prompt:
      "Mengapa perkembangan mekanika kuantum (Prinsip Ketidakpastian Heisenberg) meruntuhkan pandangan determinisme mekanistik kaku ala Iblis Laplace (Laplace's Demon)?",
    options: [
      {
        id: "a",
        text: "Karena posisi dan momentum partikel subatomik tidak dapat diukur secara presisi sekaligus, membuktikan sifat probabilitas intrinsik pada skala mikro.",
      },
      {
        id: "b",
        text: "Karena partikel subatomik bergerak lebih cepat daripada kecepatan cahaya sehingga mendahului waktu.",
      },
      {
        id: "c",
        text: "Karena Iblis Laplace adalah tokoh mitologi yang terbukti tidak nyata oleh teori relativitas.",
      },
      {
        id: "d",
        text: "Karena sains modern telah membuktikan bahwa tidak ada partikel di dalam atom.",
      },
    ],
    correctId: "a",
    explanation:
      "Prinsip Ketidakpastian Heisenberg (Δx · Δp ≥ ℏ/2) menetapkan bahwa alam pada skala subatomik tidak bersifat deterministik mekanistik Newtonian, melainkan memiliki sifat probabilistik dasar yang membantah klaim determinisme materialistis kaku.",
  },
  {
    id: 13,
    prompt:
      "Mulla Sadra mengajukan doktrin Asalat al-Wujud (Keutamaan Eksistensi). Bagaimana doktrin ini menjelaskan hubungan antara Pencipta dan alam semesta?",
    options: [
      {
        id: "a",
        text: "Esensi (mahiyah) adalah kenyataan murni, sedangkan keberadaan (wujud) hanyalah konsep abstrak di pikiran.",
      },
      {
        id: "b",
        text: "Keberadaan (wujud) adalah realitas tunggal yang bergradasi (tasykik al-wujud); alam semesta bukanlah entitas mandiri, melainkan ketergantungan eksistensial konstan pada Sumber Eksistensi Mutlak.",
      },
      {
        id: "c",
        text: "Mulla Sadra menyatakan bahwa materi dan jiwa adalah dua zat yang terpisah secara permanen.",
      },
      {
        id: "d",
        text: "Doktrin ini mengajarkan bahwa alam semesta diciptakan dari gabungan empat elemen Yunani kuno.",
      },
    ],
    correctId: "b",
    explanation:
      "Bagi Mulla Sadra, keberadaan (wujud) adalah realitas murni objektif. Alam semesta tidak memiliki eksistensi mandiri yang 'diberikan' lalu lepas dari Tuhan, melainkan bersifat rabt al-wujud — keberadaan yang seluruh hakikatnya adalah ketergantungan berkelanjutan pada Sang Wajib al-Wujud.",
  },
  {
    id: 14,
    prompt:
      "Dalam simulasi sebab-akibat biologis situs ini, Kepunahan Massal K-Pg (~66 juta tahun lalu) disajikan sebagai contoh kontingensi sejarah. Apa relevansinya bagi munculnya Homo sapiens?",
    options: [
      {
        id: "a",
        text: "Tumbukan asteroid mengubah DNA dinosaurus secara langsung menjadi spesiasi mamalia modern.",
      },
      {
        id: "b",
        text: "Kepunahan dinosaurus membebaskan relung ekologis dominan, memungkinkan radiasi adaptif mamalia berkembang hingga melahirkan garis primata dan manusia.",
      },
      {
        id: "c",
        text: "Asteroid membawa sel-sel manusia purba yang dibekukan dari ruang angkasa (panspermia murni).",
      },
      {
        id: "d",
        text: "Peristiwa tersebut menyebabkan atmosfer bumi kehilangan seluruh kandungan air selama 10 juta tahun.",
      },
    ],
    correctId: "b",
    explanation:
      "Tumbukan Chicxulub memusnahkan dinosaurus dominan, membuka jalan bagi mamalia untuk mengisi relung ekologis (adaptive radiation). Ini memperlihatkan kontingensi kausal sejarah biologis yang berada dalam kerangka skenario ketetapan Ilahi (Qadar).",
  },
  {
    id: 15,
    prompt:
      "Dalam epistemologi proses berpikir (al-fikr), mengapa penginderaan fakta (al-waqi') saja tidak cukup untuk menghasilkan pemikiran (fikr), melainkan membutuhkan ma'lumat as-sabiqah (informasi awal)?",
    options: [
      {
        id: "a",
        text: "Tanpa informasi awal yang menghubungkan fakta dengan makna, otak hanya memproses sinyal indrawi pasif tanpa mampu menarik kesimpulan atau pemahaman rasional.",
      },
      {
        id: "b",
        text: "Karena penginderaan manusia selalu salah 100% dan harus diganti oleh imajinasi murni.",
      },
      {
        id: "c",
        text: "Karena ma'lumat as-sabiqah adalah kode genetik yang ditanamkan di dalam sel darah merah.",
      },
      {
        id: "d",
        text: "Otak manusia tidak memerlukan informasi awal karena pengetahuan bersifat bawaan lahir tanpa belajar.",
      },
    ],
    correctId: "a",
    explanation:
      "Proses berpikir (al-fikr) membutuhkan 4 elemen: 1) Otak, 2) Penginderaan, 3) Realitas/Fakta, dan 4) Ma'lumat as-Sabiqah (informasi awal). Tanpa ma'lumat sabiqah, seseorang yang melihat simbol asing hanya mengindra garis tanpa memahami maknanya. Pengajaran nama-nama benda pada Nabi Adam AS adalah asal ma'lumat sabiqah manusia.",
  },
  {
    id: 16,
    prompt:
      "Mengapa Leslie's Firing Squad Analogy membantah kecukupan penjelasan Weak Anthropic Principle (WAP) terhadap Fine-Tuning alam semesta?",
    options: [
      {
        id: "a",
        text: "Seseorang yang selamat dari 100 penembak jitu yang semuanya meleset tidak boleh sekadar berkata 'Tentu saja mereka meleset karena saya masih hidup', melainkan harus bertanya mengapa mereka semua meleset.",
      },
      {
        id: "b",
        text: "Regu tembak membuktikan bahwa hukum fisika bersifat acak dan tidak memiliki pola.",
      },
      {
        id: "c",
        text: "WAP terbukti benar secara matematis karena penembak jitu selalu menggunakan senapan berperedam.",
      },
      {
        id: "d",
        text: "Analogi regu tembak menunjukkan bahwa manusia tidak memiliki kehendak bebas di hadapan hukum alam.",
      },
    ],
    correctId: "a",
    explanation:
      "John Leslie menunjukkan bahwa WAP hanya menjelaskan kondisi agar pengamatan terjadi, bukan sebab mengapa kondisi yang sangat tidak mungkin itu terealisasi. Selamat dari 100 penembak jitu menuntut penjelasan sebab (desain/perencanaan), bukan sekadar observasi pasif.",
  },
  {
    id: 17,
    prompt:
      "Menurut Fakhruddin Al-Razi dalam Nihayat al-'Uqul, mengapa fakta bahwa hukum-hukum alam dapat dirumuskan secara matematis justru membuktikan kontingensinya?",
    options: [
      {
        id: "a",
        text: "Karena hukum matematika bersifat subjektif dan selalu berubah setiap abad.",
      },
      {
        id: "b",
        text: "Karena nilai variabel dan konstanta fisika tersebut secara logis bisa berharga berapa saja; keberadaan nilai spesifik menuntut adanya Mukhassis (Zat yang menentukan nilai tersebut).",
      },
      {
        id: "c",
        text: "Karena Al-Razi menganggap ilmu matematika adalah cabang dari teologi mistis.",
      },
      {
        id: "d",
        text: "Karena fisika matematis hanya berlaku di bumi dan tidak berlaku di luar angkasa.",
      },
    ],
    correctId: "b",
    explanation:
      "Al-Razi menunjukkan bahwa konstanta alam (seperti G, c, ℏ) tidak memiliki keharusan logis mutlak untuk bernilai spesifik. Nilai-nilai tersebut bersifat mumkin. Terpilihnya nilai spesifik yang memungkinkan kehidupan menuntut adanya Mukhassis (Zat Penentu) yang Berkehendak.",
  },
  {
    id: 18,
    prompt:
      "Mengapa klaim sebagian fisikawan populer bahwa 'alam semesta muncul dari ketiadaan (nothing)' melalui fluktuasi vakum kuantum dikritik sebagai kekeliruan kategorikal oleh para filsuf sains?",
    options: [
      {
        id: "a",
        text: "Karena vakum kuantum bukanlah ketiadaan mutlak ('adam mahd), melainkan ruang bermedan kuantum yang tunduk pada hukum fisika dan energi titik-nol.",
      },
      {
        id: "b",
        text: "Karena mekanika kuantum tidak diperbolehkan dipakai dalam teori kosmologi.",
      },
      {
        id: "c",
        text: "Karena fluktuasi vakum kuantum membutuhkan suhu di atas 1.000 derajat Celsius.",
      },
      {
        id: "d",
        text: "Karena istilah vakum hanya boleh digunakan untuk tabung hampa udara laboratorium.",
      },
    ],
    correctId: "a",
    explanation:
      "Filsuf sains (seperti David Albert) dan mutakallimin menegaskan bahwa vakum kuantum adalah entitas fisik yang memiliki hukum, medan, dan energi. Ketiadaan mutlak ('adam mahd) tidak memiliki properti atau hukum apapun. Mengidentifikasi vakum kuantum sebagai 'nothing' adalah keliruan kategorikal.",
  },
  {
    id: 19,
    prompt:
      "Bagaimana Hukum Kedua Termodinamika (peningkatan entropi menuju Heat Death) menyokong argumen bahwa waktu masa lalu alam semesta bersifat terhingga (berawal)?",
    options: [
      {
        id: "a",
        text: "Jika alam semesta telah ada selama waktu tak terhingga ke belakang, maka kematian termal (Heat Death) pasti sudah terjadi dari dulu; fakta bahwa bintang masih bersinar membuktikan usianya terhingga.",
      },
      {
        id: "b",
        text: "Hukum kedua membuktikan bahwa energi dapat diciptakan dari tidak ada oleh reaksi kimia bintang.",
      },
      {
        id: "c",
        text: "Karena entropi akan turun menjadi nol ketika seluruh bintang di galaksi padam.",
      },
      {
        id: "d",
        text: "Termodinamika hanya berlaku untuk mesin uap dan tidak berlaku untuk skala kosmologis.",
      },
    ],
    correctId: "a",
    explanation:
      "Jika waktu masa lalu bersifat abadi tanpa awal (t → -∞), proses peningkatan entropi yang tidak dapat dibalikkan pasti sudah mencapai puncak Kematian Termal (Heat Death). Masih adanya energi berguna dan bintang aktif membuktikan kosmos memiliki permulaan waktu yang terhingga.",
  },
  {
    id: 20,
    prompt:
      "Bagaimana metodologi situs Rantai Sebab-Akibat ini mensintesiskan wahyu Al-Qur'an (seperti QS Al-Anbiya:30) dengan pembuktian rasional kosmologi?",
    options: [
      {
        id: "a",
        text: "Memperlakukan wahyu sebagai dogma tanpa perlu diuji atau dipahami oleh akal manusia.",
      },
      {
        id: "b",
        text: "Menggunakan penalaran rasional-ontologis untuk membuktikan keniscayaan Sebab Pertama (Wajib al-Wujud), sementara wahyu Al-Qur'an bertindak sebagai konfirmasi dan penunjuk petunjuk kosmologis yang selaras dengan akal ('aql).",
      },
      {
        id: "c",
        text: "Menggantikan seluruh teori sains fisika dengan ayat-ayat harfiah tanpa penafsiran kontekstual.",
      },
      {
        id: "d",
        text: "Menolak semua penemuan kosmologi modern jika tidak dituliskan secara eksplisit dalam kitab klasik.",
      },
    ],
    correctId: "b",
    explanation:
      "Situs ini menerapkan Integrasi Epistemologis: Akal rasional digunakan untuk membuktikan keniscayaan ontologis Wajib al-Wujud melalui dalil kontingensi & kausalitas. Wahyu Al-Qur'an (QS Al-Anbiya:30, Adh-Dhariyat:47, Al-Ikhlas) mengonfirmasi kesimpulan akal tersebut, menegaskan keselarasan wahyu dan akal murni.",
  },
];

export function ReflectionMode() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (panelMode !== "reflection") return null;

  const handleAnswer = (qid: number, optId: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: optId });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correctId).length;
  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[460px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-yellow-50 to-emerald-50 dark:from-yellow-950/30 dark:to-emerald-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-yellow-600" />
            Mode Refleksi
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            20 pertanyaan · Uji pemahaman mendalam tentang metafisika, kosmologi & tauhid
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup refleksi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-5">
          {submitted && (
            <div className="rounded-md bg-foreground text-background p-4 text-center">
              <p className="text-2xl font-bold mb-1">
                {score} / {QUESTIONS.length}
              </p>
              <p className="text-xs opacity-80">
                {score === QUESTIONS.length
                  ? "MasyaAllah — pemahaman Anda luar biasa sempurna!"
                  : score >= 15
                  ? "Sangat Bagus — Anda memahami konsep metafisika dan kosmologi dengan sangat mendalam."
                  : score >= 10
                  ? "Cukup Baik — lanjutkan refleksi pada node yang masih meragukan."
                  : "Pelajari kembali Mode Argumen & Glosarium, lalu coba lagi."}
              </p>
            </div>
          )}

          {QUESTIONS.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = submitted && userAnswer === q.correctId;
            const isWrong = submitted && userAnswer && userAnswer !== q.correctId;

            return (
              <div key={q.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      submitted
                        ? isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {submitted ? (
                      isCorrect ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <XIcon className="w-3 h-3" />
                      )
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <p className="text-xs font-semibold leading-relaxed">{q.prompt}</p>
                </div>

                <div className="space-y-1.5 pl-7">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const showCorrect = submitted && opt.id === q.correctId;
                    const showWrong = submitted && isSelected && opt.id !== q.correctId;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(q.id, opt.id)}
                        disabled={submitted}
                        className={cn(
                          "w-full text-left text-[11px] px-3 py-2 rounded-md border transition-all flex items-start gap-2",
                          !submitted && "hover:bg-muted cursor-pointer",
                          showCorrect && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700",
                          showWrong && "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700",
                          !showCorrect && !showWrong && isSelected && "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700",
                          !isSelected && !showCorrect && !showWrong && "border-border bg-background"
                        )}
                      >
                        <span className="font-mono font-semibold text-[10px] flex-shrink-0 mt-0.5">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="pl-7 mt-1">
                    <div className="rounded-md bg-muted p-2 text-[10px] leading-relaxed">
                      <strong className="text-foreground">Penjelasan:</strong>{" "}
                      <span className="text-muted-foreground">{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 flex items-center justify-between gap-2">
        {submitted ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Coba lagi
          </button>
        ) : (
          <>
            <span className="text-[10px] text-muted-foreground">
              {Object.keys(answers).length} / {QUESTIONS.length} terjawab
            </span>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={cn(
                "text-xs px-3 py-1.5 rounded-md transition-colors",
                allAnswered
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Periksa jawaban
            </button>
          </>
        )}
      </div>
    </div>
  );
}
