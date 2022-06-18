const ad = document.querySelector('#ad');
const soyad = document.querySelector('#soyad');
const mail = document.querySelector('#mail');


const form = document.querySelector('#form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi')

form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

// tüm kisiler dizisi

const tumKisilerDizisi = [];
let secilenSatir = undefined;

function kisiIslemleriniYap(event) {

    if (event.target.classList.contains('btn--delete')) {
        const silinecekTr = event.target.parentElement.parentElement;
        const silinecekMail = event.target.parentElement.previousElementSibling.textContent;
        rehberdenSil(silinecekTr, silinecekMail)
    } else if (event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = 'Güncelle';
        const secilenTr = event.target.parentElement.parentElement;
        const silinecekMail = secilenTr.cells[2].textContent;

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;

    }
}

function rehberdenSil(silinecekTrElement, silinecekMail) {
    silinecekTrElement.remove();

    //console.log(silinecekTrElement,silinecekMail);
    // maile göre silme işlemi
    /*  tumKisilerDizisi.forEach((kisi, index) => {
         if (kisi.mail === silinecekMail) {
              tumKisilerDizisi.splice(index,1);
         }
     }); */

    const yeniKisiListesi = tumKisilerDizisi.filter((kisi, index) => {
        return kisi.mail !== silinecekMail;
    });

    tumKisilerDizisi.length = 0;
    tumKisilerDizisi.push(...yeniKisiListesi)


    alanlariTemizle();
    document.querySelector('.kaydetGuncelle').value='Kaydet';
}


function kaydet(e) {
    e.preventDefault();

    const eklenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value
    }



    const sonuc = verileriKontrolEt(eklenecekKisi);
    if (sonuc.durum) {

        if (secilenSatir) {
            kisiyiGuncelle(eklenecekKisi);
        }
        else {
            kisiEkle(eklenecekKisi);
        }


    } else {
        bilgiOlustur(sonuc.mesaj, sonuc.durum);
    }
}

function kisiyiGuncelle(kisi) {
    // kisi parametresinde secilen kisinin yeni degerleri vardır

    for (let i = 0; i < tumKisilerDizisi.length; i++) {
        if (tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent) {
            tumKisilerDizisi[i]=kisi;
            break;
            
        }
        
    }

    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;

    document.querySelector('.kaydetGuncelle').value = 'Kaydet';

    secilenSatir = undefined;

}

function kisiEkle(eklenecekKisi) {
    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `<td>${eklenecekKisi.ad}</td>
     <td>${eklenecekKisi.soyad}</td>
     <td>${eklenecekKisi.mail}</td>
     <td>
         <button class="btn btn--edit"> <i class="far fa-edit">
             </i></button>
         <button class="btn btn--delete"><i class="far fa-trash-alt">

             </i> </button>

     </td>`

    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekKisi);
    bilgiOlustur('Kişi rehbere kaydedildi.', true)
}

function verileriKontrolEt(kisi) {
    // objelerde in kullanımı

    for (const deger in kisi) {
        if (kisi[deger]) {
            // console.log(kisi[deger]);
        }
        else {
            const sonuc = {
                durum: false,
                mesaj: 'boş alan bırakmayınız'
            }

            return sonuc;
        }

    }

    alanlariTemizle();
    return {
        durum: true,
        mesaj: "Kaydedildi"
    };

}

function bilgiOlustur(mesaj, durum) {

    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    /*      if (durum) {
            olusturulanBilgi.classList.add('bilgi--success')
        }else{
             olusturulanBilgi.classList.add('bilgi--error');
        } */

    olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');

    document.querySelector('.container').insertBefore(olusturulanBilgi, form);
    // insertBefore ile mesajı formun basına getirdik

    // setTimeout setInterval

    setTimeout(function () {
        const silinecekDiv = document.querySelector('.bilgi');
        if (silinecekDiv) {
            silinecekDiv.remove();
        }
    }, 2000)
}

function alanlariTemizle() {
    ad.value = "";
    soyad.value = "";
    mail.value = "";
}