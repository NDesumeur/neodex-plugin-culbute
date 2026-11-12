# Culbute

Un jeu d'adresse en pixel art : une bouteille d'eau saute de meuble en meuble dans un salon, en faisant des tours sur elle-même. Elle doit toujours retomber debout.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Espace**, **↑** ou **clic** : maintiens pour charger le saut, lâche pour lancer la bouteille.
- **En l'air**, maintiens de nouveau : la bouteille tourne deux fois plus vite.
- **P** ou **Échap** : pause (pas en plein saut).

## Comment ça marche

- Plus tu maintiens, plus le saut va **loin et haut**. La jauge à côté de la bouteille et des points blancs montrent tout le saut ; le point jaune marque où elle retombe.
- En l'air, la bouteille tourne toute seule, lentement. **Maintenir** la fait tourner plus vite : à toi de doser pour qu'elle ait fait un tour (ou deux) en arrivant.
- Elle doit se poser **debout** sur le dessus d'un meuble, à 40° près. Presque droite (11° près), c'est **PARFAIT** : les points comptent double.
- Sauter **par-dessus** un meuble pour atteindre le suivant rapporte plus. Chaque culbute réussie d'affilée ajoute un bonus.
- Si elle retombe sur le meuble de départ, rien n'est perdu. Si elle se **renverse** ou tombe **par terre**, la partie est finie.
- Tables, tabourets, piles de livres, commodes et caisses : les meubles rapetissent et s'écartent à mesure qu'on avance. Un chiffre marque chaque dizaine.

## Statistiques

Le panneau Records garde ton **meilleur score**, le nombre de **parties**, de **culbutes** et de culbutes **parfaites**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Culbute → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
