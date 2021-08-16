
--GET ALL REPORTS

SELECT
* 
FROM 
NODE_REPORT_reports r
LEFT JOIN NODE_REPORT_sections s ON s.reportid = r.id
LEFT JOIN NODE_REPORT_sectionsubsections ss ON ss.Sectionid = s.id
LEFT JOIN NODE_REPORT_subsections su ON ss.subsectionid = su.id





SELECT
* 
FROM 
NODE_REPORT_reports r
LEFT JOIN NODE_REPORT_subscriptions s ON (s.reportid = r.id)
LEFT JOIN NODE_REPORT_frequencies f ON (s.frequencyid = f.id)
