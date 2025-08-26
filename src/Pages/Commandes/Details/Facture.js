import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  Col,
  Container,
} from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';

import LoadingSpiner from '../../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../../components/capitalizeFunction';
import { useOneCommande } from '../../../Api/queriesCommande';
import { useParams } from 'react-router-dom';
import React from 'react';
import html2pdf from 'html2pdf.js';

import PaiementsHistorique from '../PaiementsHistorique/PaiementsHistorique';
import LivraisonHistorique from '../Livraison/ListeLivraisonHistorique';
import {
  companyAdresse,
  companyName,
  companyOwnerName,
  companyServices,
  companyTel,
  outil_1,
  outil_10,
  outil_11,
  outil_12,
  outil_2,
  outil_3,
  outil_4,
  outil_5,
  outil_6,
  outil_7,
  outil_8,
  outil_9,
} from '../../CompanyInfo/CompanyInfo';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export default function Facture() {
  const { id } = useParams();
  const { data: selectedCommande, isLoading, error } = useOneCommande(id);
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });
  // const reactToPrintFn = useReactToPrint({
  //   content: () => contentRef.current,
  //   documentTitle: 'Facture',
  // });

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
                onClick={reactToPrintFn}
              >
                <i className='fas fa-print align-center me-1'></i> Imprimer
              </Button>

              <Button color='danger' onClick={exportPDFFacture}>
                <i className='fas fa-paper-plane  me-1 '></i>
                Télécharger en PDF
              </Button>
            </div>
          </Col>

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}

          <div ref={contentRef} className='mt-4'>
            {!error && !isLoading && (
              <Card
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
                      className='d-flex flex-column gap-3 justify-content-center align-item-center'
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
                    <h2 className='text-center text-info '> {companyName} </h2>
                    <h6
                      style={{
                        width: '50%',
                      }}
                      className='text-center text-light bg-info  px-2 py-1 rounded-3 mx-auto mb-2'
                    >
                      {' '}
                      {companyOwnerName}{' '}
                    </h6>
                    <div className='text-info font-size-11 d-flex flex-column gap-0 justify-content-center align-item-center text-center mb-2'>
                      <span>Tout Pour la Construction</span>
                      <span>{companyServices}</span>
                      <span>{companyAdresse}</span>
                      <span>
                        {' '}
                        <strong className='font-size-12'>Info: </strong>{' '}
                        {companyTel}
                      </span>
                    </div>
                    <div className='d-flex gap-3  justify-content-center align-item-center'>
                      <CardImg src={outil_5} style={{ width: '50px' }} />
                      <CardImg src={outil_8} style={{ width: '50px' }} />
                      <CardImg src={outil_10} style={{ width: '50px' }} />
                      <CardImg src={outil_6} style={{ width: '50px' }} />
                      <CardImg src={outil_11} style={{ width: '50px' }} />
                      <CardImg src={outil_12} style={{ width: '50px' }} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                      }}
                      className='d-flex gap-1 flex-column justify-content-center align-item-center'
                    >
                      <CardImg src={outil_4} style={{ width: '50px' }} />
                      <CardImg src={outil_7} style={{ width: '50px' }} />
                      <CardImg src={outil_9} style={{ width: '50px' }} />
                    </div>
                  </CardHeader>
                  <div className=' my-2 px-2 '>
                    <div className='d-flex justify-content-between align-item-center mt-2'>
                      <CardText>
                        <strong>Facture N°: </strong>
                        <span className='text-danger'>
                          {formatPrice(
                            selectedCommande?.commandeData?.commandeId
                          )}{' '}
                        </span>
                      </CardText>
                      <CardText>
                        <strong> Date:</strong>{' '}
                        {new Date(
                          selectedCommande?.commandeData?.createdAt
                        ).toLocaleDateString()}
                      </CardText>
                    </div>

                    {/* Infos Client */}
                    <div className='d-flex justify-content-between align-item-center  '>
                      <CardText>
                        <strong>Client: </strong>
                        {capitalizeWords(
                          selectedCommande?.commandeData?.fullName
                        )}{' '}
                      </CardText>
                      <CardText>
                        <strong>Tél: </strong>
                        {formatPhoneNumber(
                          selectedCommande?.commandeData?.phoneNumber
                        )}
                      </CardText>
                    </div>
                    <CardText className='text-start'>
                      <strong>Livraison: </strong>
                      {capitalizeWords(selectedCommande?.commandeData?.adresse)}
                    </CardText>
                  </div>
                  {/* Bordure Séparateur */}

                  <div className='my-2 p-2'>
                    <table className='table align-middle table-nowrap table-hover table-bordered border-2 border-double border-info text-center'>
                      <thead>
                        <tr>
                          <th>Qté</th>
                          <th>Désignations</th>
                          <th>P.U</th>
                          <th>Montant</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedCommande?.commandeData?.items?.map(
                          (article) => (
                            <tr key={article?._id}>
                              <td>{article?.quantity} </td>
                              <td>
                                {capitalizeWords(article?.produit?.name)}{' '}
                              </td>
                              <td>{formatPrice(article?.customerPrice)} F </td>
                              <td>
                                {formatPrice(
                                  article?.customerPrice * article?.quantity
                                )}
                                {' F'}
                              </td>
                            </tr>
                          )
                        )}
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
                            {formatPrice(
                              selectedCommande?.paiementCommande
                                ? selectedCommande?.paiementCommande
                                    ?.totalAmount
                                : selectedCommande?.commandeData?.totalAmount
                            )}{' '}
                            F
                          </strong>
                        </CardText>
                        <div>
                          <CardText className='text-center '>
                            Payé:
                            <strong style={{ fontSize: '14px' }}>
                              {' '}
                              {selectedCommande?.paiementCommande
                                ? formatPrice(
                                    selectedCommande?.paiementCommande
                                      ?.totalPaye
                                  )
                                : 0}{' '}
                              F
                            </strong>
                          </CardText>
                          <CardText className='text-center '>
                            Réliqua:
                            <strong style={{ fontSize: '14px' }}>
                              {' '}
                              {formatPrice(
                                selectedCommande?.paiementCommande
                                  ? selectedCommande?.paiementCommande
                                      ?.totalAmount -
                                      selectedCommande?.paiementCommande
                                        ?.totalPaye
                                  : selectedCommande?.commandeData?.totalAmount
                              )}{' '}
                              F
                            </strong>
                          </CardText>
                        </div>
                      </div>
                    </div>
                    <p className=' mt-2 text-info'>
                      Arrêté la présente facture à la somme de:{' '}
                      <strong style={{ fontSize: '14px' }}>
                        {formatPrice(
                          selectedCommande?.paiementCommande
                            ? selectedCommande?.paiementCommande?.totalAmount
                            : selectedCommande?.commandeData?.totalAmount
                        )}{' '}
                        F
                      </strong>
                    </p>
                    <p className='font-size-10 text-center'>
                      Merci pour votre confiance et votre achat chez{' '}
                      {companyName}. Nous espérons vous revoir bientôt!
                    </p>
                  </CardFooter>
                </CardBody>
              </Card>
            )}
          </div>
          {/* Historique de Paiement */}
          <PaiementsHistorique
            id={id}
            reliqua={
              selectedCommande?.paiementCommande
                ? selectedCommande?.paiementCommande?.totalAmount -
                  selectedCommande?.paiementCommande?.totalPaye
                : selectedCommande?.commandeData?.totalAmount
            }
          />
          {/* Historique de Paiement */}

          {/* Historique de Lvraison */}
          <LivraisonHistorique
            id={id}
            commandeItems={selectedCommande?.commandeData}
          />
          {/* Historique de Lvraison */}
        </Container>
      </div>
    </React.Fragment>
  );
}
