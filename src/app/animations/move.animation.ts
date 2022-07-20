import { animate, style, transition, trigger, state } from "@angular/animations";

export const moveAnimation = trigger('moveAnimation', [
	state('move-to-start', style({
		transform: 'scale(0.7)',
		opacity: 0.4,
	})),
	state('move-from-start-down', style({
		transform: 'translateY(-2.5rem)',
	})),
	state('move-from-start-up', style({
		transform: 'translateY(2.5rem)',
	})),
	state('move-done', style({
		transform: 'scale(1)',
		opacity: 1,
	})),
	state('move-to-trash', style({
		background: 'transparent',
		opacity: 1,
	})),
	state('move-to-trash-done', style({
		transform: 'translateX(-100%)',
		opacity: 0,
	})),
	transition('move-to-start => move-done', animate('230ms ease-in')),
	transition('move-from-start-up => move-done', animate('120ms ease-out')),
	transition('move-from-start-down => move-done', animate('120ms ease-out')),
	transition('move-to-trash => move-to-trash-done', animate('250ms ease-out')),
])
