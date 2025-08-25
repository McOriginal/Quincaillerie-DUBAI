import React, { useRef } from 'react';
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
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import {
  companyAdresse,
  companyName,
  companyTel,
} from '../CompanyInfo/CompanyInfo';

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
import { html2pdf } from 'html2pdf.js';
import { useReactToPrint } from 'react-to-print';
import { useAllDevis, useDeleteDevis } from '../../Api/queriesDevis';
import { useNavigate } from 'react-router-dom';
import { deleteButton } from '../components/AlerteModal';

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

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
export default function DevisListe() {
  // Afficher tous les Devis
  const { data: devisData, isLoading, error } = useAllDevis();
  const { mutate: deleteDevis } = useDeleteDevis();
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Devis' breadcrumbItem='Liste de Devis' />

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}
          {!error && devisData.length === 0 && (
            <div className='mt-4 d-flex justify-content-center align-items-center flex-column'>
              <p className='text-center font-size-18 text-danger'>
                Aucun Devis enregistré !
              </p>

              <Button
                color='info'
                className='add-btn mt-2'
                onClick={() => navigate('/newDevis')}
              >
                <i className='fas fa-plus align-center me-1'></i> Ajouter un
                Devis
              </Button>
            </div>
          )}
          {devisData?.length > 0 &&
            devisData?.map((dev, index) => (
              <Row
                key={dev._id}
                className='d-flex flex-column justify-content-center'
              >
                {/* // Bouton */}
                <Col className='col-sm-auto'>
                  <div className='d-flex gap-4  justify-content-center align-items-center'>
                    <Button
                      color='info'
                      className='add-btn'
                      id='create-btn'
                      onClick={reactToPrintFn}
                    >
                      <i className='fas fa-print align-center me-1'></i>{' '}
                      Imprimer
                    </Button>

                    <Button color='danger' onClick={exportPDFFacture}>
                      <i className='fas fa-paper-plane  me-1 '></i>
                      Télécharger en PDF
                    </Button>
                  </div>
                </Col>
                {/* // ------------------------------------------- */}
                <Col className='col-sm-auto mt-4'>
                  <div className='d-flex gap-4  justify-content-center align-items-center'>
                    <Button
                      color='warning'
                      onClick={() => navigate(`/updateDevis/${dev?._id}`)}
                    >
                      <i className='fas fa-edit align-center me-1'></i> Modifier
                    </Button>

                    <Button
                      color='danger'
                      onClick={() => {
                        deleteButton(dev?._id, 'Ce Devis', deleteDevis);
                      }}
                    >
                      <i className='fas fa-trash  me-1 '></i>
                      Supprimer
                    </Button>
                  </div>
                </Col>
                {/* // ------------------------------------------- */}

                <Card
                  ref={contentRef}
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
                    <div className='d-flex justify-content-between align-item-center mt-2'>
                      <CardText className='font-size-18'>
                        <strong>Motif: Devis des articles </strong>{' '}
                      </CardText>
                      <CardText>
                        <strong> Date:</strong>{' '}
                        {new Date(dev.createdAt).toLocaleDateString()}
                      </CardText>
                    </div>

                    <div className='my-2 p-2'>
                      <table className='table align-middle table-nowrap table-hover table-bordered border-2 border-info text-center'>
                        <thead>
                          <tr>
                            <th>Qté</th>
                            <th>Désignations</th>
                            <th>P.U</th>
                            <th>Montant</th>
                          </tr>
                        </thead>

                        <tbody>
                          {dev?.items.map((article) => (
                            <tr key={article._id}>
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
                              {formatPrice(dev?.totalAmount)} F{' '}
                            </strong>{' '}
                          </CardText>
                        </div>
                      </div>
                    </CardFooter>
                  </CardBody>
                </Card>
              </Row>
            ))}
        </Container>
      </div>
    </React.Fragment>
  );
}
