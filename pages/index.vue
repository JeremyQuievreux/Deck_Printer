<template>
    <div class="main-container">
        <div class="cards-container">
            <div v-for="(card, index) in selectedCards" :key="index" class="card-container">
                <p>{{ card.name }}</p>
                <img :src="card.pic_url" alt="">
                <input type="number" v-model="card.quantity" min="0" @change="updateQuantity(index)">
            </div>
        </div>
        <div class="deck-container">
            <p>Deck container</p>
        </div>
        <button @click="generatePDF(selectedCards)">Test PDF</button>
    </div>
</template>
<script>
import { cards } from '../data/cards';
import { jsPDF } from 'jspdf'; // Import de jsPDF
import backImageUrl from "../img/back.png";
export default {
    data() {
        return {
            test: "Hello World",
            jeremy: "Jeremy",
            cards: [...cards, cards[0], cards[1]],
            selectedCards: cards.map(card => ({ ...card, quantity: 0 })),
            backImageUrl: backImageUrl
        }
    },
    methods: {
        updateQuantity(index) {
            // Assurez-vous que la quantité est un entier positif
            this.selectedCards[index].quantity = Math.max(0, Math.floor(this.selectedCards[index].quantity));
        },
        async generatePDF(selectedCards) {

            let nouveauTableau = [];

            // Parcourir chaque objet dans le tableau donné
            selectedCards.forEach(objet => {
                // Vérifier si la quantité est supérieure à 0
                if (objet.quantity > 0) {
                    // Ajouter l'objet autant de fois que spécifié par sa quantité
                    for (let i = 0; i < objet.quantity; i++) {
                        nouveauTableau.push(objet);
                    }
                }
            });
            this.generatePDFWithQuantity(nouveauTableau);
        },
        async generatePDFWithQuantity(selectedCards) {
            // Création d'une instance jspdf
            const doc = new jsPDF();

            // Calcul de la taille de la page
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Calcul des marges
            const marginLeft = (pageWidth - 3 * 63 - 2 * 1) / 2; // Marge gauche
            const marginTop = (pageHeight - 3 * 88 - 2 * 1) / 2; // Marge supérieure

            // Dimensions et espacements des cartes
            const cardWidth = 63; // Largeur de la carte
            const cardHeight = 88; // Hauteur de la carte
            const horizontalSpacing = 1; // Espacement horizontal (en mm)
            const verticalSpacing = 1; // Espacement vertical (en mm)
            const cardsPerPage = 9; // Nombre de cartes par page

            let pageNumber = 1;
            for (let i = 0; i < selectedCards.length; i += cardsPerPage) {
                if (pageNumber > 1) {
                    doc.addPage(); // Ajoute une nouvelle page après la première
                }
                for (let j = i; j < i + cardsPerPage && j < selectedCards.length; j++) {
                    const row = Math.floor((j - i) / 3); // 3 cartes par ligne
                    const col = (j - i) % 3; // 3 cartes par colonne
                    const x = marginLeft + col * (cardWidth + horizontalSpacing); // Position x de la carte
                    const y = marginTop + row * (cardHeight + verticalSpacing); // Position y de la carte
                    doc.addImage(selectedCards[j].pic_url, 'PNG', x, y, cardWidth, cardHeight);
                }
                // Ajouter une page vide après chaque page de cartes
                doc.addPage();

                // Ajouter neuf images du dos de la carte sur la page vide
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        const x = marginLeft + k * (cardWidth + horizontalSpacing);
                        const y = marginTop + l * (cardHeight + verticalSpacing);
                        doc.addImage(this.backImageUrl, 'PNG', x, y, cardWidth, cardHeight);
                    }
                }

                pageNumber++;
            }

            // Enregistrement et téléchargement du PDF
            doc.save('cartes_pokemon.pdf');
        },
        async fetchImage(url) {
            const response = await fetch(url);
            const blob = await response.blob();
            return blob;
        }
    }
}
</script>

<style lang="scss">
.main-container {
    display: flex;
    .cards-container {
        border: 2px solid red;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 70%;
    }
    
    .card-container {
        border: 2px solid green;
        display: flex;
        flex-direction: column;
        max-width: 250px;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
        }
        input {
            margin-top: 20px;
        }
    }
    .deck-container {
        border: 2px solid blue;
        width: 30%;
    }
}
</style>
