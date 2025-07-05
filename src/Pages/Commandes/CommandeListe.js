import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAllCommandes, useDeleteCommande } from '../../Api/queriesCommande';
import { useCancelDecrementMultipleStocks } from '../../Api/queriesProduits';

export default function CommandeListe() {
  // Afficher toutes les commandes
  const { data: commandes, isLoading, error } = useAllCommandes();
  const { mutate: cancelCommandeAndStock } = useCancelDecrementMultipleStocks();

  // State de chargement pour la suppression
  const [isDeleting, setIsDeletting] = useState(false);

  // Annuler une Ordonnance
  const navigate = useNavigate();

  // Navigation ver la FACTURE avec ID de Paiement
  const handleCommandeClick = (id) => {
    navigate(`/facture/${id}`);
  };

  // ---------------------------
  // Fonction pour exeuter l'annulation de la décrementation des stocks
  function cancelCommande(comm) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `Attention après l'Annulation les produits seront ajouter sur votre STOCK !  `,
        text: 'Voulez-vous continuer ?',
        icon: 'question',
        iconColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Oui, Continuer',
        cancelButtonText: 'Non',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          try {
            const payload = {
              commandeId: comm._id,
              items: comm.items.map((item) => ({
                produit: item.produit,
                quantity: item.quantity,
              })),
            };

            // --------------------------------
            setIsDeletting(true);
            // Exécuter l'annulation
            cancelCommandeAndStock(payload, {
              onSuccess: () => {
                setIsDeletting(false);
                swalWithBootstrapButtons.fire({
                  title: 'Succès!',
                  text: `Commande Annulé avec succès les produits sont ajouté sur le STOCK.`,
                  icon: 'success',
                });
              },
              onError: (e) => {
                setIsDeletting(false);
                swalWithBootstrapButtons.fire({
                  title: 'Erreur',
                  text:
                    e?.response?.data?.message ||
                    'Une erreur est survenue lors de la suppression.',
                  icon: 'error',
                });
              },
            });
          } catch (e) {
            setIsDeletting(false);
            swalWithBootstrapButtons.fire({
              title: 'Erreur',
              text:
                e ||
                e?.response?.data?.message ||
                "Une erreur est survenue lors de l'Annulation.",
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setIsDeletting(false);
          swalWithBootstrapButtons.fire({
            title: 'Commande non Annulée',
            icon: 'error',
          });
        }
      });
  }
  // ------------------------------------------------------------

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Commande' breadcrumbItem='Historique' />
          {/* -------------------------- */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='commandeList'>
                    <Row className='g-4 mb-3'></Row>

                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {commandes?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucune commande pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='commandeTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                Date de Commande
                              </th>
                              <th className='sort' data-sort='fullName'>
                                Client
                              </th>
                              <th className='sort' data-sort='phoneNumber'>
                                Téléphone
                              </th>
                              <th className='sort' data-sort='adresse'>
                                Adresse de Livraison
                              </th>
                              <th className='sort' data-sort='items'>
                                Article
                              </th>
                              <th className='sort' data-sort='status'>
                                Status
                              </th>

                              <th className='sort' data-sort='action'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className='list form-check-all text-center'>
                            {commandes?.commandesListe?.length > 0 &&
                              commandes?.commandesListe?.map((comm) => (
                                <tr key={comm._id}>
                                  <th scope='row'>
                                    {new Date(
                                      comm.createdAt
                                    ).toLocaleDateString('fr-Fr', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })}
                                  </th>
                                  <td>{capitalizeWords(comm.fullName)}</td>
                                  <td>{formatPhoneNumber(comm.phoneNumber)}</td>
                                  <td>{capitalizeWords(comm.adresse)}</td>

                                  <td>
                                    {comm.items.length} acticles
                                    {'  '}
                                  </td>
                                  <td>
                                    <span
                                      className={`badge badge-soft-${
                                        comm?.status === 'livré' && 'success'
                                      }
                                            ${
                                              comm?.status ===
                                                'partiellement livré' &&
                                              'danger'
                                            }
                                            ${
                                              comm?.status === 'attente' &&
                                              'warning'
                                            }
                                         text-uppercase`}
                                    >
                                      {comm?.status}
                                    </span>
                                  </td>

                                  <td>
                                    {isDeleting && <LoadingSpiner />}
                                    {!isDeleting && (
                                      <div className='d-flex gap-2'>
                                        <div className='show-details'>
                                          <button
                                            className='btn btn-sm btn-info show-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#showdetails'
                                            onClick={() => {
                                              handleCommandeClick(comm?._id);
                                            }}
                                          >
                                            <i className=' bx bx-show-alt text-white'></i>
                                          </button>
                                        </div>

                                        <div className='remove'>
                                          <button
                                            className='btn btn-sm btn-danger remove-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#deleteRecordModal'
                                            onClick={() => {
                                              cancelCommande(comm);
                                            }}
                                          >
                                            <i className='ri-delete-bin-fill text-white'></i>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                      <div className='noresult' style={{ display: 'none' }}>
                        <div className='text-center'>
                          <lord-icon
                            src='https://cdn.lordicon.com/msoeawqm.json'
                            trigger='loop'
                            colors='primary:#121331,secondary:#08a88a'
                            style={{ width: '75px', height: '75px' }}
                          ></lord-icon>
                          <h5 className='mt-2'>Sorry! No Result Found</h5>
                          <p className='text-muted mb-0'>
                            We've searched more than 150+ Orders We did not find
                            any orders for you search.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='d-flex justify-content-end'>
                      <div className='pagination-wrap hstack gap-2'>
                        <Link
                          className='page-item pagination-prev disabled'
                          to='#'
                        >
                          Previous
                        </Link>
                        <ul className='pagination listjs-pagination mb-0'></ul>
                        <Link className='page-item pagination-next' to='#'>
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
