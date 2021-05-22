import * as plants from './plants';
import * as soils from './soils';
import * as items from './items';

const emptyPlant = `    
    
    
    
`;

const emptySoil = `    `;
export const planterImage = `-----`;

export const plantModels = { ...plants, empty: emptyPlant };
export const soilModels = { ...soils, empty: emptySoil };
export const itemModels = { ...items };
