# 8. Arquitetura de Deploy (CI/CD)

O deploy será totalmente automatizado pela Vercel. Um git push para a branch principal irá acionar o processo de build, teste e deploy para produção, incluindo a implantação das migrações e funções do Supabase.