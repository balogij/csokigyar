    class Csoki {
        constructor(_id, tipus, tomeg, csomagolas, rendelt_db) {
            this._id = _id;
            this.tipus = tipus;
            this.tomeg =  tomeg;
            this.csomagolas = csomagolas;
            this.rendelt_db = rendelt_db
        }
        
        // Segédfüggvény a megjelenítéshez
        getTipusDisplay() {
            if (this.tipus === 'ét') return 'Étcsokoládé';
            if (this.tipus === 'tej') return 'Tejcsokoládé';
            if (this.tipus === 'fehér') return 'Fehér csokoládé';
            return 'Ismeretlen';
        }
        
        // Segédfüggvény a Bootstrap class nevéhez
        getCardClass() {
            return `card-${this.tipus}`;
        }
    }



    async function loadChocolatesFromFile() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const csokiObjects = [];
        const fileName = 'csokibolt.txt';
        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;

        try {
            // Fetch API hívás a fájl tartalmának lekérésére a tárhelyről
            const response = await fetch(fileName);

            // Ellenőrizzük, hogy a kérés sikeres volt-e (pl. 404-et nem kapott)
            if (!response.ok) {
                throw new Error(`HTTP hiba! Status: ${response.status} - Lehetséges, hogy a fájl (${fileName}) nem található.`);
            }

            // Kiolvassuk a fájl tartalmát szövegként
            const fileContent = await response.text();
            
            // Feldolgozzuk a szöveget soronként
            const lines = fileContent.trim().split('\n');

            lines.forEach(line => {
                const parts = line.split(';');
                if (parts.length === 5) {
                    // Létrehozzuk a Csoki objektumot az adatokból
                    const csoki = new Csoki(parseInt(parts[0].trim()), parts[1].trim().toLowerCase(), parseInt(parts[2].trim()), parts[3].trim().toLowerCase(), parseInt(parts[4].trim()));
                    csokiObjects.push(csoki);
                }
            });

            if(csokiObjects.length>0){
                container.innerHTML = '';
                // 2. A JavaScript objektumot/tömböt JSON stringgé alakítjuk
                const listAsJsonString = JSON.stringify(csokiObjects);

                // 3. Eltároljuk a LocalStorage-ban egy kulcs (pl. 'productList') alatt
                localStorage.setItem('csokiList', listAsJsonString);

                console.log("A lista sikeresen elmentve a LocalStorage-ba.");                
            }

            csokiObjects.forEach(csoki => {
                // Létrehozzuk az oszlopot (Bootstrap grid elem)
                const colDiv = document.createElement('div');
                // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
                colDiv.classList.add('col'); 
                
                // Létrehozzuk a kártya tartalmát
                colDiv.innerHTML = `
                    <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                        <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                        <hr>
                        <ul class="list-unstyled">
                            <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                            <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                        </ul>
                    </div>
                `;

                    // Hozzáadjuk a kártyát a fő konténerhez
                    container.appendChild(colDiv);
            });

            // 5x4 = 20 elemnek kell lennie. Ellenőrzés:
            console.log(`Feldolgozott elemek száma: ${csokiObjects.length}. A rács 5x4-es kialakítású (Bootstrap row-cols-5).`);    

        } catch (error) {
            console.error("Hiba történt a fájl betöltése vagy feldolgozása során:", error);
            container.innerHTML = `<div>Hiba: ${error.message}</div>`;
        }
    }

    async function handleFavorite() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;
        // 1. Lekérjük a JSON stringet a LocalStorage-ból
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        // 2. Ellenőrizzük, hogy létezik-e az adat, és nem üres-e
        if (storedListString) {
            // 3. Visszaalakítjuk JavaScript objektummá/tömbbé
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            // Ha még soha nem volt tárolva, használjuk az eredeti betöltési logikát (pl. fájlból)
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
            // Ide jön a fájlból való betöltés kódja
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }
        const sortedByRendeles = csokik.sort((a, b) => b.rendelt_db - a.rendelt_db);
        const threeLargestByRendelés = sortedByRendeles.slice(0, 3);

        threeLargestByRendelés.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleDarkChocolate() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }
        const etcsokik = csokik.filter(termek => termek.tipus === 'ét');

        etcsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleMilkChocolate() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }
        const tejcsokik = csokik.filter(termek => termek.tipus === 'tej');

        tejcsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleWhiteChocolate() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }
        const fehercsokik = csokik.filter(termek => termek.tipus === 'fehér');

        fehercsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleAllChocolate() {
        const termek_gombsor = document.getElementById('termek_gombok');
        termek_gombsor.hidden = false;

        const menu_container = document.getElementById('rolunk');
        menu_container.innerHTML = '';
        menu_container.hidden = true;
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        container.hidden = false;
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }

        csokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }


/**
 * Kezeli a Rendelés menüpont kattintását.
 */
function handleOrder(e) {
    e.preventDefault();
    const termek_gombsor = document.getElementById('termek_gombok');
    termek_gombsor.hidden = true;
    
    const mozaik = document.getElementById('csoki-list-container');
    mozaik.innerHTML = '';
    mozaik.hidden = true;

        const storedListString = localStorage.getItem('csokiList');
        let legorduloelem = '';
        let csokiObjects = [];
        csokik = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt._id, tarolt.tipus, tarolt.tomeg, tarolt.csomagolas, tarolt.rendelt_db);
                csokik.push(csoki);
            })
        }

        csokik.forEach(csoki => {
            legorduloelem += `
                <option value="${csoki.getTipusDisplay()} (${csoki.tomeg}g)">${csoki.getTipusDisplay()} (${csoki.tomeg}g)</option>
            `;
        });        


    const menu_container = document.getElementById('rolunk');
    menu_container.hidden = false;
    menu_container.innerHTML = `
    <div class="container mt-5 p-4 bg-light rounded shadow-sm">
        <h1 class="mb-4 text-center text-primary">Megrendelés</h1>
                <p class="lead text-center mb-5">Töltse ki az űrlapot a finom csokoládék megrendeléséhez.</p>

                <form class="needs-validation" novalidate>
                    
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">1. Vásárlói adatok</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                
                                <div class="col-md-6">
                                    <label for="fullName" class="form-label">Teljes név</label>
                                    <input type="text" class="form-control" id="fullName" required>
                                    <div class="invalid-feedback">Kérjük, adja meg a teljes nevét.</div>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="email" class="form-label">Email cím</label>
                                    <input type="email" class="form-control" id="email" required>
                                    <div class="invalid-feedback">Kérjük, adjon meg egy érvényes email címet.</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="phone" class="form-label">Telefonszám (opcionális)</label>
                                    <input type="tel" class="form-control" id="phone">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">2. Rendelés Tartalma</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                
                                <div class="col-md-8">
                                    <label for="productSelect" class="form-label">Válassza ki a terméket</label>
                                    <select class="form-select" id="productSelect" required>
                                        <option value="">Válasszon...</option>` +
                                        legorduloelem                                        
                                        + `</select>
                                    <div class="invalid-feedback">Kérjük, válasszon terméket.</div>
                                </div>
                                
                                <div class="col-md-4">
                                    <label for="quantity" class="form-label">Mennyiség (db)</label>
                                    <input type="number" class="form-control" id="quantity" min="1" value="1" required>
                                    <div class="invalid-feedback">Kérjük, adja meg a mennyiséget.</div>
                                </div>

                            </div>
                            
                            <div class="mt-3">
                                <button type="button" onclick="AddItemRendeles()" class="btn btn-outline-success btn-sm">Termék hozzáadása</button>
                            </div>
                            <div class="mt-3" id="rendeleseklista">
                            </div>
                        </div>
                    </div>
                    
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">3. Szállítás és Fizetés</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                
                                <div class="col-12">
                                    <label for="address" class="form-label">Szállítási cím</label>
                                    <input type="text" class="form-control" id="address" placeholder="Utca, házszám" required>
                                    <div class="invalid-feedback">Kérjük, adja meg a szállítási címet.</div>
                                </div>

                                <div class="col-md-8">
                                    <label for="city" class="form-label">Város</label>
                                    <input type="text" class="form-control" id="city" required>
                                    <div class="invalid-feedback">Kérjük, adja meg a várost.</div>
                                </div>
                                <div class="col-md-4">
                                    <label for="zip" class="form-label">Irányítószám</label>
                                    <input type="text" class="form-control" id="zip" required>
                                    <div class="invalid-feedback">Kérjük, adja meg az irányítószámot.</div>
                                </div>
                                
                                <div class="col-12 mt-4">
                                    <label class="form-label">Fizetési mód</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="paymentMethod" id="cashOnDelivery" value="cod" required>
                                        <label class="form-check-label" for="cashOnDelivery">
                                            Utánvét (készpénzben a futárnak)
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="paymentMethod" id="cardOnline" value="card" required>
                                        <label class="form-check-label" for="cardOnline">
                                            Bankkártyás fizetés (online)
                                        </label>
                                    </div>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="notes" class="form-label">Megjegyzés a rendeléshez (opcionális)</label>
                        <textarea class="form-control" id="notes" rows="3"></textarea>
                    </div>
                    
                    <div class="form-check mb-4">
                        <input class="form-check-input" type="checkbox" value="" id="termsAndConditions" required>
                        <label class="form-check-label" for="termsAndConditions">
                            Elolvastam és elfogadom az Általános Szerződési Feltételeket (ÁSZF).
                        </label>
                        <div class="invalid-feedback">A rendeléshez el kell fogadni az ÁSZF-et.</div>
                    </div>

                    <button class="btn btn-primary btn-lg w-100" type="submit">Rendelés Elküldése</button>

                </form>
    </div>
    `;
}

/**
 * Kezeli a Rólunk menüpont kattintását.
 */
function handleAbout(e) {
    e.preventDefault();
    const termek_gombsor = document.getElementById('termek_gombok');
    termek_gombsor.hidden = true;

    const mozaik = document.getElementById('csoki-list-container');
    mozaik.innerHTML = '';
    mozaik.hidden = true;
    const menu_container = document.getElementById('rolunk');
    menu_container.hidden = false;
    menu_container.innerHTML = `
    <div class="container mt-5 p-4 bg-light rounded shadow-sm">
        <img src="./csokigyar.png" alt="CsokiGyárLogo" title="CsokiGyár" class="img-fluid mb-4 rounded shadow-sm" id="imgLogo">
        <h2 class="display-5 text-center mb-4 text-dark">
            A Kézműves Csokoládé Műhelye
        </h2>
        
        <p class="lead">
            Üdvözöljük a CSOKIGYÁR-ban, ahol a csokoládé nem csupán édesség, hanem művészi alkotás, és a minőség szenvedéllyel párosul. Közvetlenül a gyár kapujában található delikátesz üzletünk nem más, mint a gyár lelke, egy hely, ahol a frissen készített termékek a legfinomabb formájukban kerülnek az Ön asztalára.
        </p>

        <hr class="my-4">

        <h3 class="text-primary">💖 A Minőség, Amely Egyenesen a Gyárból Érkezik</h3>
        
        <p>
            Amit nálunk talál, az a **tökéletes frissesség garanciája**. Mint gyári delikátesz üzlet, Ön az elsők között élvezheti a legújabb kreációinkat. Minden egyes tábla, bonbon és praliné a legmagasabb minőségű, gondosan válogatott **kakaóbabokból** és **természetes alapanyagokból** készül, mesterséges adalékanyagok nélkül.
        </p>

        <h3 class="mt-4 text-primary">✨ Amit Kínálunk</h3>
        <ul class="list-group list-group-flush">
            <li class="list-group-item bg-light"><strong>Kézműves Bonbonok:</strong> Egyedi, limitált kiadású, kézzel készített pralinék és bonbonok, melyek minden falatban meglepetést rejtenek.</li>
            <li class="list-group-item bg-light"><strong>Single Origin (Egyetlen Eredetű) Táblák:</strong> Különböző termőterületekről származó, tiszta csokoládék, amelyek bemutatják a kakaóbab eredeti, terroir jellegét.</li>
            <li class="list-group-item bg-light"><strong>Friss Édességek:</strong> Frissen sütött csokoládés sütemények, forró csokoládé különlegességek és desszertek, amik azonnal elrabolják a szívét.</li>
            <li class="list-group-item bg-light"><strong>Delikátesz Válogatások:</strong> Exkluzív ajándékcsomagok és válogatások, amelyek ideálisak különleges alkalmakra.</li>
        </ul>

        <h3 class="mt-4 text-primary">🎁 Egyedi Élmények és Kóstolók</h3>
        
        <p>
            Látogasson el hozzánk, ha valami igazán különlegesre vágyik! Rendszeresen szervezünk **csokoládé kóstolókat**, ahol bevezetjük Önt a kakaó és a csokoládékészítés rejtelmeibe. Fedezze fel, hogyan párosíthatja a különböző csokoládékat kávéval, borral vagy párlatokkal, és találja meg az Ön személyes favoritját.
        </p>

        <p class="text-center mt-5 mb-0 fs-5 fw-bold text-success">
            Várjuk szeretettel! Lépjen be hozzánk, és engedje, hogy a csokoládé illata és íze elvarázsolja!
        </p>

    </div>
    `;

}

function AddItemRendeles(){
    selectedItem = document.getElementById('productSelect');

    item_quantity = document.getElementById('quantity');

    const ujsor = document.createElement('div');
    ujsor.classList.add('col'); 
    ujsor.innerHTML = `
        <p>`+ selectedItem.value +` ` + item_quantity.value +` db</p>
    `;

    rendeleseklista = document.getElementById("rendeleseklista");
    rendeleseklista.appendChild(ujsor)
}
