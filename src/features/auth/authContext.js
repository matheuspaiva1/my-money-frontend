import { createContext } from 'react';

// Objeto de contexto isolado num arquivo próprio (sem exportar componentes)
// para não conflitar com a regra de Fast Refresh que exige que arquivos de
// componente só exportem componentes.
export const AuthContext = createContext(null);
