import { ReactElement, useEffect, useRef, useState } from 'react';
import { Header } from '@mantine/core';
import Link from 'next/link';

import DarkModeToggler from '../DarkModeToggler/DarkModeToggler';

import styles from './Navbar.module.scss';
import { motion } from 'framer-motion';
import ConditionalLink from '@components/ConditionalLink/ConditionalLink';

class Hover {
	elem = null;
	left = null;
	top = null;
	width = null;
	height = null;
}

const Navbar = (): ReactElement => {
	const [hovered, setHovered] = useState(false);
	const [hoveredPos, setHoveredPos] = useState<any>({
		last: new Hover(),
		cur: new Hover(),
	});

	const linksRef = useRef<HTMLDivElement>(null);

	const links = [
		{
			link: '/browse',
			label: 'browse',
		},
		{
			link: '/add',
			label: 'add',
		},
		{
			link: '/filter',
			label: 'filter',
		},
		{
			link: '/connections',
			label: 'connections',
		},
	];

	const onHover = (elem: any) => {
		if (!linksRef.current) return;

		if (hovered) {
			if (hoveredPos.cur.elem == elem) return;
		}

		const parentRect = linksRef.current.getBoundingClientRect();
		const linkRect = elem.getBoundingClientRect();

		setHoveredPos((currentHovered: any) => ({
			last: hovered ? currentHovered.cur : new Hover(),
			cur: {
				elem,
				left: linkRect.left - parentRect.left,
				top: linkRect.top - parentRect.top,
				width: linkRect.width,
				height: linkRect.height,
			},
		}));

		if (!hovered) setHovered(true);
	};

	const onExit = () => {
		if (!hoveredPos.cur) return;

		setHovered(false);
	};

	const getMotionDiv = () => {
		if (!hoveredPos) return <></>;

		const hasFrom = hoveredPos.last.elem != null;

		const from = hoveredPos.last;
		const to = hoveredPos.cur;

		const padding = { x: 15, y: 10 };

		const duration = hasFrom ? 0.15 : 0;

		const animateFrom = hasFrom && {
			x: from.left - padding.x / 2,
			y: from.top - padding.y / 2,
			width: from.width + padding.x,
			height: from.height + padding.y,
		};

		const animateTo = {
			x: to.left - padding.x / 2,
			y: to.top - padding.y / 2,
			width: to.width + padding.x,
			height: to.height + padding.y,
		};

		return (
			<motion.div
				initial={animateFrom}
				animate={animateTo}
				transition={{ type: 'tween', duration }}
				className={`${styles.linkBackground} ${
					hovered && styles.linkBackgroundHovered
				}`}
			/>
		);
	};

	return (
		<div className={styles.navbar}>
			<ConditionalLink href="/" className={styles.navbarTitle}>
				bhop archive
			</ConditionalLink>

			<div
				ref={linksRef}
				className={`navbar-links ${styles.links}`}
				onMouseLeave={(e) => onExit()}>
				{getMotionDiv()}

				{links.map((link) => (
					<ConditionalLink
						key={link.link}
						href={link.link}
						className={styles.link}
						onMouseOver={(e: any) => onHover(e.currentTarget)}>
						{link.label}
					</ConditionalLink>
				))}
			</div>

			<div style={{ flexGrow: 1 }}></div>

			<DarkModeToggler />
		</div>
	);
};

export default Navbar;
