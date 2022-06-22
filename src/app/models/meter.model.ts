import { AbmColum } from "./abm.model";
import { DbForeignKey, DbTableContext } from "./database.model";
import { Brand, BrandDbTableContext } from "./brand.model";
import { ConstantUnit, ConstantUnitDbTableContext } from "./constant-unit.model";

export interface Meter extends DbForeignKey {
	id: number;
	current: number;
	voltage: number;
  activeConstantValue: number;
  activeConstantUnit_id: number;
  reactveConstantValue: number;
  reactveConstantUnit_id: number;
	brand_id: number;
	foreign: {
		brand: Brand,
    activeConstantUnit: ConstantUnit,
    reactiveConstantUnit: ConstantUnit,
	}
}

export const MeterDbTableContext: DbTableContext = {
	tableName: 'meters',
	foreignTables: [
		{
			tableName: BrandDbTableContext.tableName,
			foreignKey: 'brand_id',
			properyName: 'brand',
		},
    {
			tableName: ConstantUnitDbTableContext.tableName,
			foreignKey: 'activeConstantUnit_id',
			properyName: 'activeConstantUnit',
		},
    {
			tableName: ConstantUnitDbTableContext.tableName,
			foreignKey: 'reactiveConstantUnit_id',
			properyName: 'reactiveConstantUnit',
		},
	]
};

export const MeterTableColumns: AbmColum[] = [
	{
		field: 'foreign.brand.name',
		header: 'Marca',
		sortable: true,
	},
	{
		field: 'foreign.brand.model',
		header: 'Modelo',
		sortable: true,
	},
	{
		field: 'current',
		header: 'Corriente (A)',
		sortable: false,
		styleClass: 'text-center',
	},
	{
		field: 'voltage',
		header: 'Voltaje (V)',
		sortable: false,
		styleClass: 'text-center',
	},
	{
		field: 'activeConstantValue',
		header: 'Activa',
		sortable: false,
		styleClass: 'text-center',
	},
	{
		field: 'foreign.activeConstantUnit.name',
		header: 'Act. Uni.',
		sortable: false,
	},
	{
		field: 'reactiveConstantValue',
		header: 'Reactiva',
		sortable: false,
		styleClass: 'text-center',
	},
	{
		field: 'foreign.reactiveConstantUnit.name',
		header: 'React. Uni.',
		sortable: false,
	},
];
