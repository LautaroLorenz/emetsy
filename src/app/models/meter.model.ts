import { AbmColum } from "./abm.model";
import { DbForeignKey, DbTableContext } from "./database.model";
import { Brand, BrandDbTableContext } from "./brand.model";
import { ConstantUnit, ConstantUnitDbTableContext } from "./constant-unit.model";

export interface Meter extends DbForeignKey {
	id: number;
	maximumCurrent: number;
	ratedCurrent: number;
	ratedVoltage: number;
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
		field: 'maximumCurrent',
		header: 'Imax[A]',
		sortable: false,
		styleClass: 'text-center',
		headerTooltip: 'Corriente máxima'
	},
	{
		field: 'ratedCurrent',
		header: 'In[A]',
		sortable: false,
		styleClass: 'text-center',
		headerTooltip: 'Corriente nominal'
	},
	{
		field: 'ratedVoltage',
		header: 'Un[V]',
		sortable: false,
		styleClass: 'text-center',
		headerTooltip: 'Tensión nominal'
	},
	{
		field: 'activeConstantValue',
		header: 'Cte Activa',
		sortable: false,
		styleClass: 'text-center',
		headerTooltip: 'Constante energía activa'
	},
	{
		field: 'foreign.activeConstantUnit.name',
		header: '[Activa]',
		sortable: false,
		headerTooltip: 'Unidad energía activa'
	},
	{
		field: 'reactiveConstantValue',
		header: 'Cte Reactiva',
		sortable: false,
		styleClass: 'text-center',
		headerTooltip: 'Constante energía reactiva'
	},
	{
		field: 'foreign.reactiveConstantUnit.name',
		header: '[Reactiva]',
		sortable: false,
		headerTooltip: 'Unidad energía reactiva'
	},
];
