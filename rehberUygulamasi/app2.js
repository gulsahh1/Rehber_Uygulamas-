class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}

class Util {
    static bosAlanKontrolEt(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }

  
}

class Ekran {
    constructor() {
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.kaydetGuncelleBtn = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit',this.kaydetGuncelle.bind(this));
        //bind.this: this'in sürekli yapısı ve içeriği değişen bir yapısı oldugu için kullandık.
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click',this.guncelleVeyaSil.bind(this))
        this.depo = new Depo();
        this.secilenSatir=undefined; //update ve delete butonlarına basıldıgında ilgili tr elementi tutulur
        this.kisileriEkranaYazdir();
    }

    bilgiOlustur(mesaj,durum){
         const uyariDivi=document.querySelector('.bilgi')
        uyariDivi.innerHTML = mesaj;
    
    
        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');
    
    
        // setTimeout setInterval
    
        setTimeout(function () {
           uyariDivi.className='bilgi';
            
        }, 2000)
    }

    alanlariTemizle(){
        this.ad.value=" ";
        this.soyad.value=" ";
        this.mail.value=" ";
    }

    guncelleVeyaSil(e){
        const tiklanmaYeri=e.target;
        if (tiklanmaYeri.classList.contains('btn--delete')) {
            this.secilenSatir=tiklanmaYeri.parentElement.parentElement;
             this.kisiyiEkrandanSil();
        }else if(tiklanmaYeri.classList.contains('btn--edit')){
            this.secilenSatir=tiklanmaYeri.parentElement.parentElement;
            this.kaydetGuncelleBtn.value='Güncelle';
            this.ad.value=this.secilenSatir.cells[0].textContent;
            this.soyad.value=this.secilenSatir.cells[1].textContent;
            this.mail.value=this.secilenSatir.cells[2].textContent;
        }
    }

    kisiyiEkrandaGuncelle(kisi){
        this.depo.kisiGuncelle(kisi,this.secilenSatir.cells[2].textContent)
        this.secilenSatir.cells[0].textContent=kisi.ad;
        this.secilenSatir.cells[1].textContent=kisi.soyad;
        this.secilenSatir.cells[2].textContent=kisi.mail;

         this.alanlariTemizle();
        this.secilenSatir=undefined;
        this.kaydetGuncelleBtn.value='Kaydet';
        this.bilgiOlustur('Kişi güncellendi.',true)



    }

    kisiyiEkrandanSil(){
        this.secilenSatir.remove();
        const silinecekMail=this.secilenSatir.cells[2].textContent;

        this.depo.kisiSil(silinecekMail)
        this.alanlariTemizle();
        this.secilenSatir=undefined;
        this.bilgiOlustur('Kişi rehberden silindi.',true)
    }

    kisileriEkranaYazdir() {
            this.depo.tumKisiler.forEach(kisi => {
                this.kisiyiEkranaEkle(kisi);
            });
        }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML = `<td>${kisi.ad}</td>
                <td>${kisi.soyad}</td>
                <td>${kisi.mail}</td>
                <td>
                    <button class="btn btn--edit"> <i class="far fa-edit">
                        </i></button>
                    <button class="btn btn--delete"><i class="far fa-trash-alt">

                        </i> </button>

                </td>`;
            this.kisiListesi.appendChild(olusturulanTr);
    }

    kaydetGuncelle(e) {

        e.preventDefault();

        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail);
    
        //tüm alanlar doldurulmuş
        if (sonuc) {
            if (this.secilenSatir) {
                // secilen satır undefined degilse güncelleme yapılacaktır.
                this.kisiyiEkrandaGuncelle(kisi)
                this.bilgiOlustur('Güncellendi.',true)
            }else{
                // secilen satır undefined ise kaydetme yapılacaktır.
             //yeni kisiyi ekrana ekler
            this.bilgiOlustur('Başarıyla eklendi',true)
            this.kisiyiEkranaEkle(kisi);
            //localStorage'a ekle
            this.depo.kisiEkle(kisi);
            }
         
            this.alanlariTemizle();
        } else { // bazı alanlar eksik
           this.bilgiOlustur('Boş alanları doldurunuz.', false);

        }
    }
}


class Depo {
    // uygulama ilk acıldıgında veriler getirilir.
    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }
    kisileriGetir() {
        let tumKisilerLocal=[];
        if (localStorage.getItem('tumKisiler') === null) {
            this.tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
    
        return tumKisilerLocal;
    }

    kisiEkle(kisi) {
    
        this.tumKisiler.push(kisi);
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
       
    }

    kisiSil(mail){
       this.tumKisiler.forEach((kisi,index)=>{
        if (kisi.mail === mail) {
            this.tumKisiler.splice(index,1);
        }
       });
       localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));

    }

    kisiGuncelle(guncelKisi,mail){
        this.tumKisiler.forEach((kisi,index)=>{
            if (kisi.mail === mail) {
               this.tumKisiler[index]=guncelKisi;
            }
           });
           localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
}


document.addEventListener('DOMContentLoaded', function (e) {
    const ekran = new Ekran();  // tüm html yapısı yüklendikten sonra function çalısır.
})