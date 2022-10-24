import ExplainerCard from './ExplainerCard';
import { useLang } from '../../store/LangContext';
import regularityMap from '../../assets/js/regularity-schema';
import auxillaryMap from '../../assets/js/auxillary-conjugations';
import styles from './styles/verb-endings.module.css'

const VerbEndings = (props) => {
    const { language } = useLang();

    const subjectsKey = {
        spanish: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'],
        french: ['je', 'tu', 'il', 'nous', 'vous', 'ils'],
        german: ['ich', 'du', 'er', 'wir', 'ihr', 'Sie'],
        italian: ['io', 'tu', 'lui', 'noi', 'voi', 'loro'],
        portuguese: ['eu', 'tu', 'ele', 'nós', 'vós', 'eles']
    }

    const subjectsText = {
        spanish: ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'],
        french: ['je', 'tu', 'il', 'nous', 'vous', 'ils'],
        german: ['ich', 'du', 'er', 'wir', 'ihr', 'sie'],
        italian: ['io', 'tu', 'lui', 'noi', 'voi', 'loro'],
        portuguese: ['eu', 'tu', 'ele', 'nós', 'vós', 'eles']
    }

    const verbs = {
        spanish: [['habl', 'ar'], ['com', 'er'], ['viv', 'ir']],
        french: [['parl', 'er'], ['chois', 'ir'], ['perd', 're']],
        german: [['leb', 'en'], ['hand', 'eln'], ['änd', 'ern']],
        italian: [['parl', 'are'], ['cred', 'ere'], ['dorm', 'ire']],
        portuguese: [['fal', 'ar'], ['com', 'er'], ['sent', 'ir']],
    }

    const tenseRoot = props.tenseRoot
    const [complexity, mood, tense] = tenseRoot.split('-')
    
    const isGermanFuture = language.name === 'german' && (tense === 'future' || tense === 'conditional')
    const isOneWord = complexity === 'simple' && !isGermanFuture

    const werden = {
        indicative: {
            future: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden']
        },
        subjunctive: {
            future: ['werde', 'werdest', 'werde', 'werden', 'werdet', 'werden'],
            conditional: ['würde', 'würdest', 'würde', 'würden', 'würdet', 'würden']
        }
    }

    const endings = isOneWord && verbs[language.name].map(([_, infinitiveEnding]) => 
        subjectsKey[language.name].map(subject =>
            regularityMap[language.name][infinitiveEnding][mood][tense][subject]
        )  
    )

    if (language.name === 'french' && !isOneWord) // je -> j' when following verb starts with vowel or h
        subjectsText.french[0] = "j'"

    const auxillaries = subjectsKey[language.name].map(subject => 
        auxillaryMap[language.name][mood][tense][subject]
    )  

    const participleEndings = {
        spanish: ['ado', 'ido', 'ido'],
        french: ['é', 'i', 'u'],
        german: ['t', 'elt', 'ert'],
        italian: ['ato', 'uto', 'ito'],
        portuguese: ['ado', 'ido', 'ido']
    }

    return(
        <div id = {styles['container']}>
            {verbs[language.name].map(([stem, infinitiveEnding], verbIndex) =>
                <article className = {styles['column']}>
                    <h2>-{infinitiveEnding} verbs  •  <span>{stem + infinitiveEnding}</span></h2>
                    <ul>
                        {subjectsText[language.name].map((subject, subjectIndex) =>
                            <li>
                                <span className = {styles['subject']}>{ subject }</span>
                                {isOneWord 
                                    ? stem // isOneWord = stem + regular ending
                                    : <> {/* isOneWord = auxillary + either pariticple or infinitive (German) */}
                                        <span className = {styles['auxillary']}>
                                            { 
                                                !isGermanFuture 
                                                    ? auxillaries[subjectIndex] // Auxillary is 'to have' 
                                                    : werden[mood][tense][subjectIndex] // Auxillary is 'will/would'
                                            }
                                        </span>

                                        { 
                                            language.name !== 'german'
                                                ? stem // If language is not German, pariticple is stem + ending
                                                : complexity === 'compound' // If language is German and complexity is compound (i.e. perfect)
                                                    ? <><span className = {styles['prefix']}>ge</span>{stem}</> // ...create the participle by adding 'ge' prefix
                                                    : <span className = {styles['infinitive']}>{ stem + infinitiveEnding }</span> // ...otherwise, use the infinitive
                                        }
                                    </>
                                }
                                {
                                    <span className = {styles['ending']}>{
                                        complexity === 'simple' // If complexity is simple...
                                            ? endings[verbIndex][subjectIndex] // ...use the regular ending
                                            : participleEndings[language.name][verbIndex] // ...otherwise, create the participle
                                    }</span>
                                }
                                { isGermanFuture && complexity === 'compound' && ' haben' /* If German, future/conditional, and compound – add 'haben' */} 
                            </li>
                        )}
                    </ul>
                </article>
            )}
        </div>
    );
}

export default VerbEndings;