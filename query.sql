
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
AND p.name NOT LIKE ('%core_hours%')
AND p.name NOT IN ('customer_filter','third_party_filter')

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
AND p.name NOT LIKE ('%core_hours%')
AND p.name NOT IN ('customer_filter','third_party_filter')

INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'both'
AND p.name NOT LIKE ('%core_hours%')
AND p.name NOT IN ('customer_filter','third_party_filter')


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



INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
ss.name = 'Support Requests - Heatmaps for Total Registered Tickets - single and full period'
AND p.name LIKE ('%core_hours%')


INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
ss.name = 'Support Requests - Total Volume Flow Diagram - single period'
AND p.name IN ('customer_filter','third_party_filter')






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

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Littlefish Performance Against SLA' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('SLA - Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Support Request Volumes' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('Support Requests - Total Volume Flow Diagram - single period')

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
AND sb.name IN ('CSAT - Customer Satisfaction Measurements - single period')

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
AND sb.name IN ('Telephony - Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Support Requests by Time of Day' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Heatmaps for Total Registered Tickets - single and full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
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
AND sb.name IN ('Support Requests - Source - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
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
AND sb.name IN ('Support Requests - Location - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
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
AND sb.name IN ('CSAT - Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
6 as [Order]
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
AND sb.name IN ('CSAT - Service Feedback Summary - single period')


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
AND sb.name IN ('Incidents - Major Incident Review - single period')

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
AND sb.name IN ('Incidents - FCR - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Volumes of Incidents by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Priority - full period')


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
AND sb.name IN ('Incidents - Category Trends - full period')


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
AND sb.name IN ('Incidents - Top 5 Categories with Subcategory - single period')


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
AND sb.name IN ('Requests - Top 5 Categories with Subcategory - single period')


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
AND sb.name IN ('Problems - Open and Closed - single period')

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
AND sb.name IN ('Problems - Open and Closed - full period')


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
AND sb.name IN ('Appendix - CSAT - Positive Customer Feedback - single period')

------------------------------------------------------------------------------------------------------Appendix B - Trended Volumes for Reference

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
AND s.name = 'Appendix B - Trended Volumes for Reference'
AND sb.name IN ('Appendix - Trended Volumes for Reference - full period')

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
AND sb.name IN ('Appendix - Category Trends Top 15 - full period')