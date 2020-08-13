import React from 'react';

const HomePage = () => {
    return(
        <div className="jumbotron">
            <h1 className="display-3 text-center">Was ist CRM <i className="fas fa-question"></i></h1>
            <p className="lead">
                <div>Customer Relationship Management (CRM) ist eine Technologie zur Verwaltung aller Beziehungen und
                    Interaktionen Ihres Unternehmens mit Kunden und potenziellen Kunden. Das Ziel ist einfach:
                    Geschäftsbeziehungen verbessern. Ein CRM-System hilft Unternehmen, mit Kunden in Verbindung zu
                    bleiben, Prozesse zu rationalisieren und die Rentabilität zu verbessern.
                </div>
            </p>
            <hr className="my-4" />
            <p>Wenn Menschen über CRM sprechen, beziehen sie sich normalerweise auf ein CRM-System, ein Tool, das bei
                der Kontaktverwaltung, dem Vertriebsmanagement, der Produktivität und vielem mehr hilft.</p>
            <p>Mithilfe einer CRM-Lösung können Sie sich während Ihres gesamten Lebenszyklus auf die Beziehungen Ihres
                Unternehmens zu einzelnen Personen konzentrieren - einschließlich Kunden, Servicebenutzern, Kollegen
                oder Lieferanten -, einschließlich der Suche nach neuen Kunden, der Gewinnung ihres Geschäfts sowie der
                Bereitstellung von Support und zusätzlichen Services während der gesamten Beziehung.</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" href="#" role="button">Neu Kund anmelden</a>
                </p>
        </div>
    );
};

export default HomePage;