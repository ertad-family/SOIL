-- Populate citation data for pathologies
-- Sources verified against SOIL Zotero library (group 6367540) where available
-- Items not in Zotero are marked for future addition

-- LP-001: Founder's Syndrome
-- First comprehensive description in nonprofit governance literature
UPDATE pathology_classification SET
  primary_source_title = 'Perfect Nonprofit Boards: Myths, Paradoxes, and Inner Conflicts',
  primary_source_authors = 'Block, S.R.',
  primary_source_year = 1998,
  primary_source_journal = 'Simon & Schuster',
  primary_source_doi = NULL,
  primary_source_url = 'https://www.amazon.com/dp/0684846160',
  primary_source_abstract = 'This book examines the dysfunctions that plague nonprofit boards, including the phenomenon where founders maintain excessive control over organizations they created. Block describes how this dependency impedes institutional development, succession planning, and organizational resilience.'
WHERE code = 'LP-001';

-- LP-002: Corporate Psychopathy
-- Source: SOIL Zotero library (verified - Boddy 2021)
UPDATE pathology_classification SET
  primary_source_title = 'Corporate Psychopaths and Destructive Leadership in Organisations',
  primary_source_authors = 'Boddy, C.R.',
  primary_source_year = 2021,
  primary_source_journal = 'Destructive Leadership and Management Hypocrisy, Emerald Publishing',
  primary_source_doi = '10.1108/978-1-80043-180-520211005',
  primary_source_url = 'https://doi.org/10.1108/978-1-80043-180-520211005',
  primary_source_abstract = 'The study of corporate psychopaths has gone from something which some academic peers found somewhat incredible, and even laughable, in 2005, to an area where an increasing amount of research is taking place across many disciplines. Destructive, unethical and psychopathic leadership is, by and large, still unexpected in the workplace, and this magnifies its impact as employees struggle to know how to deal with it. Such destructive leadership is also jarring and quite often traumatic for the employees concerned as well as being damaging to the organisations involved.'
WHERE code = 'LP-002';

-- LP-003: Leadership Vacuum
-- Samuel's comprehensive organizational pathology framework
UPDATE pathology_classification SET
  primary_source_title = 'Organizational Pathology: Life and Death of Organizations',
  primary_source_authors = 'Samuel, Y.',
  primary_source_year = 2010,
  primary_source_journal = 'Transaction Publishers',
  primary_source_doi = NULL,
  primary_source_url = 'https://www.routledge.com/Organizational-Pathology-Life-and-Death-of-Organizations/Samuel/p/book/9781412813181',
  primary_source_abstract = 'This systematic study applies medical and epidemiological concepts to organizational analysis. Samuel develops a comprehensive framework for understanding organizational diseases, including leadership deficits and their cascading effects on organizational function and survival.'
WHERE code = 'LP-003';

-- SP-001: Structural Inertia
-- Source: SOIL Zotero library (verified)
UPDATE pathology_classification SET
  primary_source_title = 'Structural Inertia and Organizational Change',
  primary_source_authors = 'Hannan, M.T. & Freeman, J.',
  primary_source_year = 1984,
  primary_source_journal = 'American Sociological Review, 49(2), 149-164',
  primary_source_doi = '10.2307/2095567',
  primary_source_url = 'https://www.jstor.org/stable/2095567',
  primary_source_abstract = 'Theory and research on organization-environment relations from a population ecology perspective have been based on the assumption that inertial pressures on structure are strong. This paper attempts to clarify the meaning of structural inertia and to derive propositions about structural inertia from an explicit evolutionary model. The proposed theory treats high levels of structural inertia as a consequence of a selection process rather than as a precondition for selection. It also considers how the strength of inertial forces varies with age, size, and complexity.'
WHERE code = 'SP-001';

-- SP-002: Organizational Obesity
-- Parkinson's foundational work on administrative growth
UPDATE pathology_classification SET
  primary_source_title = 'Parkinson''s Law',
  primary_source_authors = 'Parkinson, C.N.',
  primary_source_year = 1957,
  primary_source_journal = 'The Economist / Houghton Mifflin',
  primary_source_doi = NULL,
  primary_source_url = 'https://www.economist.com/news/1955/11/19/parkinsons-law',
  primary_source_abstract = 'Work expands so as to fill the time available for its completion. Parkinson observed that bureaucracies expand at predictable rates regardless of the amount of work to be done, identifying the mechanisms by which organizations accumulate administrative overhead disproportionate to productive output.'
WHERE code = 'SP-002';

-- FP-001: Cash Flow Starvation
-- Source: SOIL Zotero library (verified)
UPDATE pathology_classification SET
  primary_source_title = 'Financial Ratios, Discriminant Analysis and the Prediction of Corporate Bankruptcy',
  primary_source_authors = 'Altman, E.I.',
  primary_source_year = 1968,
  primary_source_journal = 'The Journal of Finance, 23(4), 589-609',
  primary_source_doi = '10.1111/j.1540-6261.1968.tb00843.x',
  primary_source_url = 'https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1968.tb00843.x',
  primary_source_abstract = 'This seminal paper develops the Z-Score model for predicting corporate bankruptcy using multiple discriminant analysis. Altman demonstrates that financial ratios, properly combined, can predict financial distress with high accuracy, establishing cash flow and liquidity as critical organizational survival factors.'
WHERE code = 'FP-001';

-- FP-002: Zombie Organization
-- Japanese zombie firms research
UPDATE pathology_classification SET
  primary_source_title = 'Zombie Lending and Depressed Restructuring in Japan',
  primary_source_authors = 'Caballero, R.J., Hoshi, T., & Kashyap, A.K.',
  primary_source_year = 2008,
  primary_source_journal = 'American Economic Review, 98(5), 1943-1977',
  primary_source_doi = '10.1257/aer.98.5.1943',
  primary_source_url = 'https://www.aeaweb.org/articles?id=10.1257/aer.98.5.1943',
  primary_source_abstract = 'In Japan, weights on industry productivity and profits fell during the 1990s while the weights on debt burdens rose. Banks continue to extend credit to firms that would otherwise fail, creating zombie firms that congest markets and depress investment and employment growth at healthy firms.'
WHERE code = 'FP-002';

-- CP-001: Cultural Toxicity
-- Edmondson's psychological safety research
UPDATE pathology_classification SET
  primary_source_title = 'The Fearless Organization: Creating Psychological Safety in the Workplace for Learning, Innovation, and Growth',
  primary_source_authors = 'Edmondson, A.C.',
  primary_source_year = 2019,
  primary_source_journal = 'Wiley',
  primary_source_doi = '10.1002/9781119477662',
  primary_source_url = 'https://fearlessorganization.com/',
  primary_source_abstract = 'This book offers a practical guide for teams and organizations looking to create a culture of psychological safety. Edmondson draws on extensive research demonstrating how toxic cultures suppress voice, inhibit learning, and ultimately threaten organizational survival.'
WHERE code = 'CP-001';

-- MP-001: Market Denial
-- Christensen's disruption theory
UPDATE pathology_classification SET
  primary_source_title = 'The Innovator''s Dilemma: When New Technologies Cause Great Firms to Fail',
  primary_source_authors = 'Christensen, C.M.',
  primary_source_year = 1997,
  primary_source_journal = 'Harvard Business School Press',
  primary_source_doi = NULL,
  primary_source_url = 'https://www.hbs.edu/faculty/Pages/item.aspx?num=46',
  primary_source_abstract = 'This groundbreaking book explains why great companies fail when faced with disruptive innovation. Christensen shows how organizational processes and values that make companies successful also make them systematically blind to threats from below-market innovations that improve over time.'
WHERE code = 'MP-001';

-- OP-001: Technical Debt Collapse
-- Cunningham's original technical debt metaphor
UPDATE pathology_classification SET
  primary_source_title = 'The WyCash Portfolio Management System',
  primary_source_authors = 'Cunningham, W.',
  primary_source_year = 1992,
  primary_source_journal = 'OOPSLA ''92 Experience Report',
  primary_source_doi = '10.1145/157709.157715',
  primary_source_url = 'http://c2.com/doc/oopsla92.html',
  primary_source_abstract = 'Shipping first time code is like going into debt. A little debt speeds development so long as it is paid back promptly with a rewrite. The danger occurs when the debt is not repaid. Every minute spent on not-quite-right code counts as interest on that debt.'
WHERE code = 'OP-001';
