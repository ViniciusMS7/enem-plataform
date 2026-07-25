// Calcula dias até o próximo ENEM (assume o primeiro domingo de novembro).
// É o elemento de assinatura visual da plataforma: aparece como um carimbo
// de correção de prova, sempre lembrando o prazo real que o aluno tem.

function diasAteEnem(): number {
  const hoje = new Date();
  let ano = hoje.getFullYear();
  let data = new Date(ano, 10, 3); // aproximação: 3 de novembro
  if (data < hoje) data = new Date(ano + 1, 10, 3);
  const diffMs = data.getTime() - hoje.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function CountdownStamp() {
  const dias = diasAteEnem();

  return (
    <div className="stamp inline-block bg-paper px-5 py-3">
      <p className="font-mono text-xs uppercase tracking-widest text-center">Faltam</p>
      <p className="font-display font-bold text-4xl text-center leading-none my-1">{dias}</p>
      <p className="font-mono text-xs uppercase tracking-widest text-center">dias para o ENEM</p>
    </div>
  );
}
