import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Commande
export const useCreateCommande = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/commandes/createCommande', data),
    onSuccess: () => queryClient.invalidateQueries(['commandes']),
  });
};

// Mettre à jour une Commande
export const useUpdateCommande = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/commandes/updateCommande/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['commandes']),
  });
};
// Lire toutes les commandes
export const useAllCommandes = () =>
  useQuery({
    queryKey: ['commandes'],
    queryFn: () =>
      api.get('/commandes/getAllCommandes').then((res) => res.data),
  });

// Obtenir une Commande
export const useOneCommande = (id) =>
  useQuery({
    queryKey: ['commandes', id],
    queryFn: () =>
      api.get(`/commandes/getOneCommande/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Commande
export const useTraitementCommande = (traitementID) =>
  useQuery({
    queryKey: ['getTraitementCommande', traitementID],
    queryFn: () =>
      api
        .get(`/commandes/getTraitementCommande/${traitementID}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Commande
export const useGetTraitementCommande = () =>
  useQuery({
    queryKey: ['getTraitementCommande'],
    queryFn: () =>
      api.get('/commandes/getTraitementCommande/').then((res) => res.data),
  });

// Supprimer une Commande
export const useDeleteCommande = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/commandes/deleteCommande/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['commandes']),
  });
};
