
INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'full'
AND p.name NOT LIKE ('%_SP%')

INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'single'
AND p.name NOT IN ('period_type','date_start','date_end')



INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
[type] IN ('template','appendix template')
AND p.name IN ('database')











INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Executive Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('Template - Executive Summary')

--SLA SUMMARY
--SUPPORT REQUEST VOLUMES

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Customer Satisfaction Measurements' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('CSAT - Customer Satisfaction Measurements')

------------------------------------------------------------------------------------------------------SERVICE DESK


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Telephony' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Telephony - Summary')

--HEATMAPS

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Support Requests by Source' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Source per period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Support Requests by Location' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Location per period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Customer Satisfaction Measurement' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - CSAT per period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Service Feedback Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - Service Feedback Summary')


------------------------------------------------------------------------------------------------------INCIDENT MANAGEMENT


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Major Incident Review' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Major Incident Review')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'First Contact Resolution' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - FCR per period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Volumes Of Incidents By Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Priority per period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Category Trends - Within Top 5 Category Types, Last 3 Months' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Category Trends per period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Top 5 Incidents by Category and Subcategory' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Top 5 Categories with Subcategory breakdown')


------------------------------------------------------------------------------------------------------REQUESTS


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Top 5 Requests by Category and Subcategory' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Top 5 Categories with Subcategory breakdown')


------------------------------------------------------------------------------------------------------PROBLEM MANAGEMENT

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Active and Closed Problems Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Open and Closed current period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Problems Open/Closed' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Open and Closed per period')


------------------------------------------------------------------------------------------------------Service Review Meetings Actions Register

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Review Meetings Actions Register'
AND sb.name IN ('Template - Actions Register')

------------------------------------------------------------------------------------------------------Appendix A - Positive Customer Feedback

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix A - Positive Customer Feedback'
AND sb.name IN ('Appendix - CSAT - Positive Customer Feedback')

------------------------------------------------------------------------------------------------------Appendix B - Trended Volumes for Reference



------------------------------------------------------------------------------------------------------Appendix C - Category Trends - Within Top 15 Category Types


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix C - Category Trends - Within Top 15 Category Types'
AND sb.name IN ('Appendix - Category Trends Top 15')