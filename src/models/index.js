import * as plants from './plants';
import * as soils from './soils';

const emptyPlant = `    
    
    
    
`;

const emptySoil = `    `;
export const planter = `-----`;

export const plantModels = { ...plants, empty: emptyPlant };
export const soilModels = { ...soils, empty: emptySoil };
