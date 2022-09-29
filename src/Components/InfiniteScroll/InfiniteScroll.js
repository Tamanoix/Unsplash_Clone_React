import React, { useState, useEffect, useRef } from 'react';
import './InfiniteScroll.css';
import { v4 as uuidv4 } from 'uuid';


const InfiniteScroll = () => {

    // On crée 3 tableaux différents, qui correspondent à nos 3 colonnes
    const [dataImg, setDataImg] = useState([[], [], []]);
    // On commence à la page 1
    const [pageIndex, setPageIndex] = useState(1);
    // On donne par défaut la valeur "random" parce qu'on ignore ce que le client veut afficher
    const [searchState, setSearchState] = useState('random');
    // On crée un state pour éviter que la fonction de recherche ne se lance dès le début
    const [firstCall, setFirstCall] = useState(true);

    const infiniteFetchData = () => {

        // Appel à l'API d'Unsplash pour récupérer les images
        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=CddeVJLlSEyA1flYFrqg2JzJlgHF13j0ajNFRNA0iZE`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            const imgsReceived = [];

            data.results.forEach((img) => {
                imgsReceived.push(img.urls.regular);
            });

            // On crée 3 tableaux différents, qui correspondent à nos 3 colonnes
            const newFreshState = [
                [...dataImg[0]],
                [...dataImg[1]],
                [...dataImg[2]],
            ];

            let index = 0;
            // On fait une 1ère boucle for pour alimenter nos 3 tableaux
            for (let i = 0 ; i < 3 ; i++) {
                // Et une 2ème boucle pour les alimenter un par un (10 images à la fois)
                for (let j = 0 ; j < 10 ; j++) {
                    newFreshState[i].push(imgsReceived[index]);
                    index++;
                }
            }

            setDataImg(newFreshState);
            // Une fois que les premières images ont été chargées, on va pouvoir refaire un appel avec recherche
            setFirstCall(false);
        })

    }

    // A l'instanciation du composant à chaque actualisation de pageIndex, on fetch les données de la page concernée
    useEffect(() => {

        infiniteFetchData();

    }, [pageIndex]);


    // Fonction de recherche
    const handleSearch = e => {
        e.preventDefault();

        setSearchState(inpRef.current.value);
        setPageIndex(1);

    };

    const searchFetchData = () => {

        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=CddeVJLlSEyA1flYFrqg2JzJlgHF13j0ajNFRNA0iZE`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            const imgsReceived = [];

            data.results.forEach((img) => {
                imgsReceived.push(img.urls.regular);
            });

            const newFreshState = [
                [],
                [],
                [],
            ];

            let index = 0;
            for (let i = 0 ; i < 3 ; i++) {
                for (let j = 0 ; j < 10 ; j++) {
                    newFreshState[i].push(imgsReceived[index]);
                    index++;
                }
            }

            setDataImg(newFreshState);
        })

    }

    useEffect(() => {
      
        // Au premier chargement, ne pas lancer cette fonction
        if (firstCall) return;

        // Sinon on peut la lancer à l'actualisation de searchState (donc la recherche)
        searchFetchData();

    }, [searchState])
    

    const inpRef = useRef();

    useEffect(() => {

        // Au scroll, on lance notre fonction qui check si le User est arrivé en bas de la page
        window.addEventListener('scroll', infiniteCheck);

        // Clean-up function
        return () => {
            window.removeEventListener('scroll', infiniteCheck);
        }

    }, []);


    // On continue de charger du contenu à l'infini
    const infiniteCheck = () => {

        // On importe les fonctions natives JS
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

        // Si la distance scrollée par le client correspond à la hauteur totale de son écran (ou la dépasse), on est donc tout en bas de l'écran
        if (scrollHeight - scrollTop <= clientHeight) {
            // On set une nouvelle page, qui va donc trigger le 1er UseEffect, et relancer le fetch des données de la nouvelle page
            setPageIndex(pageIndex => pageIndex + 1);
        };

    };


    return (
        <div className='container'>

            <form onSubmit={handleSearch}>
                <label htmlFor="search">Votre recherche</label>
                <input type="text" id='search' ref={inpRef} />
            </form>

            {/* On map nos images dans 3 colonnes différentes */}
            <div className="card-list">
                <div>
                    {dataImg[0].map((image) => {
                        return <img key={uuidv4()} src={image} alt='gallerie unsplash' />
                    })}
                </div>
                <div>
                    {dataImg[1].map((image) => {
                        return <img key={uuidv4()} src={image} alt='gallerie unsplash' />
                    })}
                </div>
                <div>
                    {dataImg[2].map((image) => {
                        return <img key={uuidv4()} src={image} alt='gallerie unsplash' />
                    })}
                </div>
            </div>

        </div>
    );
};

export default InfiniteScroll;