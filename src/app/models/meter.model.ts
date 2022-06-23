import { AbmColum } from "./abm.model";
import { DbForeignKey, DbTableContext } from "./database.model";
import { Brand, BrandDbTableContext } from "./brand.model";
import { ActiveConstantUnit, ActiveConstantUnitDbTableContext } from "./active-constant-unit.model";
import { ReactiveConstantUnit, ReactiveConstantUnitDbTableContext } from "./reactive-constant-unit.model";

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
		activeConstantUnit: ActiveConstantUnit,
		reactiveConstantUnit: ReactiveConstantUnit,
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
			tableName: ActiveConstantUnitDbTableContext.tableName,
			foreignKey: 'activeConstantUnit_id',
			properyName: 'activeConstantUnit',
		},
		{
			tableName: ReactiveConstantUnitDbTableContext.tableName,
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
		header: 'Imax [A]',
		sortable: false,
		styleClass: 'text-right',
		headerTooltip: 'Corriente máxima'
	},
	{
		field: 'ratedCurrent',
		header: 'In [A]',
		sortable: false,
		styleClass: 'text-right',
		headerTooltip: 'Corriente nominal',
	},
	{
		field: 'ratedVoltage',
		header: 'Un [V]',
		sortable: false,
		styleClass: 'text-right',
		headerTooltip: 'Tensión nominal',
	},
	{
		field: 'activeConstantValue',
		header: 'Cte. energía activa',
		sortable: false,
		styleClass: 'text-right pr-1 border-right-none',
		colSpan: 2,
		colSpanColumns: [
			{
				field: 'foreign.activeConstantUnit.name',
				styleClass: 'pl-1 text-left border-left-none',
				prefix: '[',
				suffix: ']',
			},
		],
	},
	{
		field: 'reactiveConstantValue',
		header: 'Cte. energía reactiva',
		sortable: false,
		styleClass: 'text-right pr-1 border-right-none',
		colSpan: 2,
		colSpanColumns: [
			{
				field: 'foreign.reactiveConstantUnit.name',
				styleClass: 'pl-1 text-left border-left-none',
				prefix: '[',
				suffix: ']',
			},
		],
	},
];
