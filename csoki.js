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
        const csokiObjects = [];
        const fileName = 'csokibolt.txt';
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';

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
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
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
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
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
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
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
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
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
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
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


function handleProducts(e) {
    // Megakadályozza az alapértelmezett hivatkozási viselkedést (ami az oldal tetejére ugrás lenne)
    e.preventDefault(); 
    
    console.log("Termékek menüpont aktiválva.");
    alert("A Termékek oldal betöltése folyamatban...");
    // Ide jöhet a Termékek lista betöltésének logikája
}

/**
 * Kezeli a Rendelés menüpont kattintását.
 */
function handleOrder(e) {
    e.preventDefault();
    
    console.log("Rendelés menüpont aktiválva.");
    alert("Rendelési űrlap megjelenítése...");
    // Ide jöhet a rendelési űrlap megjelenítésének logikája
}

/**
 * Kezeli a Rólunk menüpont kattintását.
 */
function handleAbout(e) {
    e.preventDefault();
 
    const container = document.getElementById('csoki-list-container');
    container.innerHTML = `
    <div class="container mt-5 p-4 bg-light rounded shadow-sm">
        
        <h2 class="display-5 text-center mb-4 text-dark">
            🍫 Bemutatkozás: Csokigyár – A Kézműves Csokoládé Műhelye
        </h2>
        
        <p class="lead">
            Üdvözöljük a **[Üzlet neve]**-ben, ahol a csokoládé nem csupán édesség, hanem művészi alkotás, és a minőség szenvedéllyel párosul. Közvetlenül a **[Csokigyár neve]** gyár kapujában található delikátesz üzletünk nem más, mint a gyár lelke, egy hely, ahol a frissen készített termékek a legfinomabb formájukban kerülnek az Ön asztalára.
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
