import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { useAllCommandes, useOneCommande } from '../../Api/queriesCommande';
import { useParams } from 'react-router-dom';
import React from 'react';
import html2pdf from 'html2pdf.js';
import { companyAdresse, companyName, companyTel } from '../Logo/logo';

import outil_1 from '../../assets/images/outil (1).png';
import outil_2 from '../../assets/images/outil (2).png';
import outil_3 from '../../assets/images/outil (3).png';
import outil_4 from '../../assets/images/outil (4).png';
import outil_5 from '../../assets/images/outil (5).png';
import outil_6 from '../../assets/images/outil (6).png';
import outil_7 from '../../assets/images/outil (7).png';
import outil_8 from '../../assets/images/outil (8).png';
import outil_9 from '../../assets/images/outil (9).png';
import outil_10 from '../../assets/images/outil (10).png';
import outil_11 from '../../assets/images/outil (11).png';
import outil_12 from '../../assets/images/outil (12).png';

export default function Facture() {
  const { id } = useParams();
  const { data: selectedCommande, isLoading, error } = useOneCommande(id);
  const { data: commandes } = useAllCommandes();
  const factureIndex = commandes?.commandesListe?.findIndex(
    (p) => p._id === id
  );
  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPDFFacture = () => {
    const element = document.getElementById('facture');
    const opt = {
      filename: 'facture.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((err) => console.error('Error generating PDF:', err));
  };

  // -----------------------------------------
  // -----------------------------------------
  // Impression
  // -----------------------------------------
  // -----------------------------------------

  const handlePrintFacture = () => {
    const content = document.getElementById('facture');
    // Ouvre une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=800,height=600');

    // Récupère tous les <style> et <link rel="stylesheet">
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('');

    printWindow.document.write(`
    <html>
      <head>
        <title>Impression d'Ordonnance</title>
        ${styles}
        <style>
          @media print {
            body {
              margin: 20px;
            }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Commande' breadcrumbItem='Factures' />

          <Col className='col-sm-auto'>
            <div className='d-flex gap-4  justify-content-center align-items-center'>
              <Button
                color='info'
                className='add-btn'
                id='create-btn'
                onClick={handlePrintFacture}
              >
                <i className='fas fa-print align-center me-1'></i> Imprimer
              </Button>

              <Button color='danger' onClick={exportPDFFacture}>
                <i className='fas fa-paper-plane  me-1 '></i>
                Télécharger le PDF
              </Button>
            </div>
          </Col>

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}

          {!error && !isLoading && (
            <Card
              id={'facture'}
              className='d-flex justify-content-center border border-info'
              style={{
                boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                borderRadius: '15px',
                width: '583px',
                margin: '20px auto',
                position: 'relative',
              }}
            >
              <CardBody>
                <CardHeader
                  style={{
                    border: '2px solid rgba(100, 169, 238, 0.5)',
                    borderRadius: '5px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '30px',
                      left: '30px',
                    }}
                    className='d-flex flex-column justify-content-center align-item-center'
                  >
                    <CardImg
                      src={outil_2}
                      style={{
                        width: '50px',
                      }}
                    />
                    <CardImg
                      src={outil_1}
                      style={{
                        width: '50px',
                      }}
                    />

                    <CardImg
                      src={outil_3}
                      style={{
                        width: '50px',
                      }}
                    />
                  </div>
                  <CardTitle className='text-center '>
                    <h3 className='text-info fw-bold'>{companyName} </h3>
                    <p
                      style={{ margin: '15px', fontSize: '10px' }}
                      className='text-info fw-bold'
                    >
                      {companyAdresse}
                    </p>
                    <p
                      style={{ margin: '15px', fontSize: '10px' }}
                      className='text-info fw-bold'
                    >
                      {companyTel}
                    </p>
                    <div className='d-flex  justify-content-center align-item-center'>
                      <CardImg src={outil_5} style={{ width: '50px' }} />
                      <CardImg src={outil_8} style={{ width: '50px' }} />
                      <CardImg src={outil_10} style={{ width: '50px' }} />
                      <CardImg src={outil_6} style={{ width: '50px' }} />
                      <CardImg src={outil_11} style={{ width: '50px' }} />
                      <CardImg src={outil_12} style={{ width: '50px' }} />
                    </div>
                  </CardTitle>
                  <div
                    style={{
                      position: 'absolute',
                      top: '30px',
                      right: '30px',
                    }}
                    className='d-flex flex-column justify-content-center align-item-center'
                  >
                    <CardImg src={outil_4} style={{ width: '50px' }} />
                    <CardImg src={outil_7} style={{ width: '50px' }} />
                    <CardImg src={outil_9} style={{ width: '50px' }} />
                  </div>
                </CardHeader>
                <div className='border-bottom border-info my-2 px-2 '>
                  <div className='d-flex justify-content-between align-item-center mt-2'>
                    <CardText>
                      <strong>Facture N°: </strong>{' '}
                      <span className='text-danger'>{factureIndex + 1} </span>
                    </CardText>
                    <CardText>
                      <strong> Date:</strong>{' '}
                      {new Date(
                        selectedCommande.createdAt
                      ).toLocaleDateString()}
                    </CardText>
                  </div>

                  {/* Infos Client */}
                  <div className='d-flex justify-content-between align-item-center  '>
                    <CardText>
                      <strong>Client: </strong>
                      {capitalizeWords(
                        selectedCommande?.commande?.fullName
                      )}{' '}
                    </CardText>
                    <CardText>
                      <strong>Tél: </strong>
                      {formatPhoneNumber(
                        selectedCommande?.commande?.phoneNumber
                      )}
                    </CardText>
                  </div>
                  <CardText className='text-start'>
                    <strong>Livraison: </strong>
                    {capitalizeWords(selectedCommande?.commande?.adresse)}
                  </CardText>
                </div>
                {/* Bordure Séparateur */}

                <div className='my-2 p-2'>
                  <table className='table align-middle table-nowrap table-hover table-bordered border-2 border-info text-center'>
                    <thead>
                      {' '}
                      <tr>
                        <th>Qté</th>
                        <th>Désignations</th>
                        <th>P.U</th>
                        <th>Montant</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedCommande?.commande?.items.map((article) => (
                        <tr key={article._id}>
                          <td>{article?.quantity} </td>
                          <td>{capitalizeWords(article?.produit?.name)} </td>
                          <td>{formatPrice(article?.produit?.price)} </td>
                          <td>
                            {formatPrice(
                              article?.produit?.price * article?.quantity
                            )}{' '}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <CardFooter>
                  <div className='p-1'>
                    <div
                      className='d-flex
                  justify-content-between align-item-center'
                    >
                      <CardText className={'text-center'}>
                        Total:{' '}
                        <strong style={{ fontSize: '14px' }}>
                          {' '}
                          {formatPrice(
                            selectedCommande?.commande['totalAmount']
                          )}{' '}
                          F{' '}
                        </strong>{' '}
                      </CardText>
                      <div>
                        <CardText className='text-center '>
                          Payé:
                          <strong style={{ fontSize: '14px' }}>
                            {' '}
                            {formatPrice(selectedCommande?.totalAmount)} F{' '}
                          </strong>{' '}
                        </CardText>
                        <CardText className='text-center '>
                          Réliqua:
                          <strong style={{ fontSize: '14px' }}>
                            {' '}
                            {selectedCommande.totalAmount -
                              selectedCommande?.commande['totalAmount']}{' '}
                            F{' '}
                          </strong>
                        </CardText>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </CardBody>
            </Card>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
}
