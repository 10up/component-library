import React from 'react';

import './styles.css';

export const AccordionHeader = ({ children }) => {
	return (
		<button className="accordion-header" type="button">
			{children}
		</button>
	);
};

export const AccordionContent = ({ children }) => {
	return <div className="accordion-content">{children}</div>;
};

export const AccordionItem = ({ children }) => {
	return <div className="accordion-item">{children}</div>;
};

export const Accordion = ({ children }) => {
	return <div className="accordion">{children}</div>;
};
