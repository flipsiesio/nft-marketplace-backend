import { JackOfClubsColors } from './jack-of-clubs.colors';
import { JackOfDiamondsColors } from './jack-of-diamonds.colors';
import { JackOfHeartsColors } from './jack-of-hearts.colors';
import { JackOfSpadesColors } from './jack-of-spades.colors';
import { KingOfClubsColors } from './king-of-clubs.colors';
import { KingOfDiamondsColors } from './king-of-diamonds.colors';
import { KingOfHeartsColors } from './king-of-hearts.colors';
import { KingOfSpadesColors } from './king-of-spades.colors';
import { QueenOfClubsColors } from './queen-of-clubs.colors';
import { QueenOfDiamondsColors } from './queen-of-diamonds.colors';
import { QueenOfHeartsColors } from './queen-of-hearts.colors';
import { QueenOfSpadesColors } from './queen-of-spades.colors';

const CardsColors = {
  jack: {
    clubs: JackOfClubsColors,
    diamonds: JackOfDiamondsColors,
    hearts: JackOfHeartsColors,
    spades: JackOfSpadesColors,
  },
  king: {
    clubs: KingOfClubsColors,
    diamonds: KingOfDiamondsColors,
    hearts: KingOfHeartsColors,
    spades: KingOfSpadesColors,
  },
  queen: {
    clubs: QueenOfClubsColors,
    diamonds: QueenOfDiamondsColors,
    hearts: QueenOfHeartsColors,
    spades: QueenOfSpadesColors,
  },
};

export default CardsColors;
